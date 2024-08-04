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

app.listen(PORT, () => {
    console.log(`Server work op port ${PORT}`)
});