const express = require(`express`);
const path = require(`path`);
const bodyParser = require(`body-parser`)
const fs = require(`fs`)
const app = express();

const PORT = 3000;

app.use(express.static(path.join(__dirname, `public`)))
app.use(bodyParser.json());
app.use(express.json());

const goodsRouter = require(`./router/goods`)
app.use(`/api/goods`, goodsRouter);

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

app.post(`/subscribe`, (req, res) => {
    let {email} = req.body;
    let data = {
        email
    }

    fs.appendFile(`subscribers.txt`, JSON.stringify(data) + `\n`, (err) => {
        if (err) {
            console.log(err)
            return res.status(500).send(`internal server error`);
        }

        res.status(201).send(`User data save sucessfully`);
    })
})

app.listen(PORT, () => {
    console.log(`Server work op port ${PORT}`)
});