const express = require(`express`);
const path = require(`path`);
const bodyParser = require(`body-parser`)
const fs = require(`fs`)
const app = express();
const nodemailer = require("nodemailer");
require('dotenv').config();

const PORT = 3000;

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_LOGIN,
        pass: process.env.GMAIL_PASSWORD
    },
});

app.use(express.static(path.join(__dirname, `public`)))
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const goodsRouter = require('./router/goods');
app.use('/api/goods', goodsRouter);

app.get(`/home`, (req, res) => {
    res.sendFile(path.join(__dirname, `public`, `index.html`))
})

app.get(`/popularProduct`, (req, res) => {
    res.sendFile(path.join(__dirname, `public`, `popularProduct`, `popularProduct.html`))
})

app.get(`/customerFeedback`, (req, res) => {
    res.sendFile(path.join(__dirname, `public`, `customerFeedback`, `customerFeedback.html`))
})

app.get(`/bestProduct`, (req, res) => {
    res.sendFile(path.join(__dirname, `public`, `bestProduct`, `bestProduct.html`))
})

app.get(`/blog`, (req, res) => {
    res.sendFile(path.join(__dirname, `public`, `blog`, `blog.html`))
})

app.get(`/admin`, (req, res) => {
    res.sendFile(path.join(__dirname, `public`, `admin`, `admin.html`))
})

let loggedIn = false;
app.get('/client', (req, res) => {
    if (!loggedIn) {
        return res.redirect('/aus');
    } else if (loggedIn) {
        return res.redirect('/profile');
    }
});

app.get('/aus', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'aus', 'identification.html'));
});

app.get('/profile', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'profile', 'profile.html'));
    loggedIn = true;
});

let user = {};
app.get('/userData', (req, res) => {
    res.json({
        login: user.login,
        email: user.email,
        password: user.password
    });
});

app.get(`/followerList`, (req, res) => {
    fs.readFile(emailFilePath, `utf8`, (err, data) => {
        if (err) {
            console.log(err);
            res.status(500).json({ error: 'Unable to read follower file' })
        }
        const followers = JSON.parse(data)
        res.json(followers);
    })
})

app.get('/events', (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    timerID = setInterval(() => {
        res.write(`data: ${JSON.stringify({ currentmail })}\n\n`);
    }, 3000);

    req.on('close', () => {
        clearInterval(timerID);
    });
});

app.get('/status', (req, res) => {
    res.json({ currentmail });
});


app.post(`/signup`, (req, res) => {
    let { login, email, password } = req.body
    let data = {
        login,
        email,
        password
    }
    fs.appendFile(`users.txt`, JSON.stringify(data) + `\n`, (err) => {
        if (err) {
            console.log(err)
            return res.status(500).send(`internal server error`);
        }

        res.status(201).send(`User data save sucessfully`);
    })
})

app.post(`/signin`, (req, res) => {
    let { email, password } = req.body
    let signup = false;
    fs.readFile(`users.txt`, `utf8`, (err, data) => {
        if (err) {
            console.log(err)
            return res.status(500).send(`internal server error`);
        }

        let users = data.split(`\n`)
        for (let el = 0; el < users.length - 1; el++) {
            if (JSON.parse(users[el]).email == email && JSON.parse(users[el]).password == password) {
                signup = true
                user = {
                    login: JSON.parse(users[el]).login,
                    email: JSON.parse(users[el]).email,
                    password: JSON.parse(users[el]).password
                };
            }
        }
    })

    setTimeout(() => {
        res.send(signup);
    }, 1000)
})
const emailFilePath = path.join(__dirname, './data/follower.json')

app.post(`/subscribe`, (req, res) => {
    let { email, code } = req.body;
    let info = {
        email,
        time: new Date().toLocaleString()
    }
    fs.readFile(emailFilePath, 'utf8', (err, data) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ error: 'Unable to read orders file' });
        }

        let fileContent = JSON.parse(data);
        if (code == randomCode) {
            fileContent.push(info);
            fs.writeFile(emailFilePath, JSON.stringify(fileContent), (err) => {
                if (err) {
                    console.error('Error writing file:', err);
                } else {
                    console.log('File has been written successfully.');
                }
            });
            res.send({ massage: `data saved` })
        } else {
            res.send({ massage: `Incorrect code` })
        }
    });
})

app.post(`/deleteFollower`, (req, res) => {
    const { email } = req.body;

    fs.readFile(emailFilePath, `utf8`, (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Unable to read follower file' });
        }

        const followers = JSON.parse(data);

        const index = followers.findIndex(follower => follower.email === email);

        if (index === -1) {
            return res.status(404).json({ error: 'Follower not found' });
        }

        followers.splice(index, 1);

        fs.writeFile(emailFilePath, JSON.stringify(followers), 'utf8', err => {
            if (err) {
                return res.status(500).json({ error: 'Unable to write to follower file' });
            }

            res.json({ message: 'Follower deleted successfully' });
        });
    });
});

let currentmail = 0;
app.post(`/sendMessage`, (req, res) => {
    fs.readFile(emailFilePath, `utf8`, (err, data) => {
        if (err) {
            console.log(err);
            res.status(500).json({ error: 'Unable to read follower file' })
        }
        const followers = JSON.parse(data)
        currentmail = 0
        let timerID = setInterval(function () {
            if (currentmail < followers.length) {
                let mailOptions = {
                    from: 'Administrator',
                    to: followers[currentmail].email,
                    subject: 'Message from cafena',
                    text: req.body.massage,
                };

                transporter.sendMail(mailOptions, function (err, info) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log(`Message was sended: ${info.response}`);
                    }
                });

                currentmail++;
                console.log(`Message ${currentmail} sent.`);
            }
            else {
                clearInterval(timerID);
                console.log('Sending completed!')
                res.status(200).json({ message: 'Email send was done' })
            }
        }, 3000)
    })
})

let randomCode;
app.post('/sendConfirmationEmail', (req, res) => {
    let { email } = req.body;

    fs.readFile(emailFilePath, 'utf8', (err, data) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ error: 'Unable to read orders file' });
        }

        let fileContent = JSON.parse(data);

        const emailExists = fileContent.some(el => el.email === email);

        if (emailExists) {
            return res.send({ message: 'This email already exists' });
        }

        randomCode = Math.floor(Math.random() * (9999 - 1000) + 1000).toString();

        let mailOptions = {
            from: 'Cafena',
            to: email,
            subject: 'Login code',
            text: randomCode,
        };

        transporter.sendMail(mailOptions, function (err, info) {
            if (err) {
                console.log(err);
                return res.status(500).json({ error: 'Failed to send email' });
            } else {
                console.log(`Message was sent: ${info.response}`);
                return res.status(200).json({ message: 'Email sent successfully' });
            }
        });

        res.send({ message: 'Code sent' });
    });
});



app.listen(PORT, () => {
    console.log(`Server work op port ${PORT}`)
});