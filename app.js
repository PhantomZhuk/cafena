const express = require(`express`);
const path = require(`path`);

const app = express();

const PORT = 3000;

app.use(express.static(path.join(__dirname, `public`)))

app.get(`/home`, (req, res)=>{
    res.sendFile(path.join(__dirname, `public`, `index.html`))
})

app.get(`/popularProduct`, (req, res)=>{
    res.sendFile(path.join(__dirname, `public`, `popularProduct`, `popularProduct.html`))
})

app.get(`/customerFeedback`, (req, res)=>{
    res.sendFile(path.join(__dirname, `public`, `customerFeedback`, `customerFeedback.html`))
})

app.get(`/bestProduct`, (req, res)=>{
    res.sendFile(path.join(__dirname, `public`, `bestProduct`, `bestProduct.html`))
})

app.get(`/blog`, (req, res)=>{
    res.sendFile(path.join(__dirname, `public`, `blog`, `blog.html`))
})

let loggedIn = false;
app.get('/client', (req, res) => {
    if (!loggedIn) {
        return res.redirect('/authentication');
    }else if (loggedIn){
        return res.redirect('/user');
    }
});

app.get('/authentication', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'Authentication', 'authentication.html'));
});

app.get('/user', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'user', 'user.html'));
});

app.listen(PORT, () => {
    console.log(`Server work op port ${PORT}`)
});