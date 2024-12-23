const express = require(`express`);
const path = require(`path`);
const nodemailer = require("nodemailer");
require('dotenv').config();
const app = express();
const mongoose = require(`mongoose`);
const multer = require('multer');
const PORT = 3000;

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_LOGIN,
        pass: process.env.GMAIL_PASSWORD
    },
});

mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('Connected to MongoDB');
    })

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(`public`));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

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

app.get('/aus', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'aus', 'identification.html'));
});

app.get('/profile', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'profile', 'profile.html'));
});

// let loggedIn = false;
// app.get('/client', (req, res) => {
//     if (!loggedIn) {
//         return res.redirect('/aus');
//     } else if (loggedIn) {
//         return res.redirect('/profile');
//     }
// });

// let user = {};
// app.get('/userData', (req, res) => {
//     res.json({
//         login: user.login,
//         email: user.email,
//         password: user.password
//     });
// });

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

// app.post(`/signup`, (req, res) => {
//     let { login, email, password } = req.body
//     let data = {
//         login,
//         email,
//         password
//     }
//     fs.appendFile(`users.txt`, JSON.stringify(data) + `\n`, (err) => {
//         if (err) {
//             console.log(err)
//             return res.status(500).send(`internal server error`);
//         }

//         res.status(201).send(`User data save sucessfully`);
//     })
// })

// app.post(`/signin`, (req, res) => {
//     let { email, password } = req.body
//     let signup = false;
//     fs.readFile(`users.txt`, `utf8`, (err, data) => {
//         if (err) {
//             console.log(err)
//             return res.status(500).send(`internal server error`);
//         }

//         let users = data.split(`\n`)
//         for (let el = 0; el < users.length - 1; el++) {
//             if (JSON.parse(users[el]).email == email && JSON.parse(users[el]).password == password) {
//                 signup = true
//                 user = {
//                     login: JSON.parse(users[el]).login,
//                     email: JSON.parse(users[el]).email,
//                     password: JSON.parse(users[el]).password
//                 };
//             }
//         }
//     })

//     setTimeout(() => {
//         res.send(signup);
//     }, 1000)
// })

const FollowerSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    time: {
        type: String,
        required: true
    }
})

const Follower = mongoose.model('Follower', FollowerSchema);

let randomCode;
app.post('/sendConfirmationEmail', async (req, res) => {
    let { email } = req.body;

    try {
        const follower = await Follower.findOne({ email });
        if (!follower) {
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
        } else {
            return res.send({ message: 'This email already exists' });
        }
    } catch (err) {
        console.log(err)
    }
});

app.post(`/subscribe`, async (req, res) => {
    let { email, code } = req.body;

    try {
        if (code == randomCode) {
            const follower = await Follower.findOne({ email });
            if (!follower) {
                const newFollower = new Follower({
                    email,
                    time: new Date().toLocaleString()
                });

                await newFollower.save();

                return res.send({ message: `data saved` });
            } else {
                return res.send({ message: 'This email already exists' });
            }
        }
    } catch (err) {
        console.log(err);
    }
})

app.get(`/followerList`, async (req, res) => {
    const follower = await Follower.find();
    res.json(follower);
})

app.post(`/deleteFollower`, (req, res) => {
    const { id } = req.body;

    Follower.findByIdAndDelete(id)
        .then(() => {
            res.json({ message: 'Follower deleted successfully' });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: 'Unable to delete follower' });
        });
});

let currentmail = 0;
app.post(`/sendMessage`, async (req, res) => {
    currentmail = 0;

    try {
        const follower = await Follower.find();

        let timerID = setInterval(function () {
            if (currentmail < follower.length) {
                let mailOptions = {
                    from: 'Administrator',
                    to: follower[currentmail].email,
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
        }, 3000);
    }catch (err) {
        console.log(err);
    }
})

app.listen(PORT, () => {
    console.log(`Server work op port ${PORT}`)
});