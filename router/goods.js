const express = require('express');
const path = require('path');
const fs = require('fs');
const { error } = require('console');
const router = express.Router();

const productsFilePath = path.join(__dirname, '../data/products.json')
const ordersFilePath = path.join(__dirname, '../data/orders.json')


router.get(`/`, (req, res)=>{
    fs.readFile(productsFilePath, `utf8`, (err, data)=>{
        if(err ){
            console.log(err);
            res.status(500).json({error: 'Unable to read product file'})
        }
        const products = JSON.parse(data)
        res.json(products);
    })
});



router.get(`/list`, (req, res)=>{
    fs.readFile(ordersFilePath, `utf8`, (err, data)=>{
        if(err ){
            console.log(err);
            res.status(500).json({error: 'Unable to read product file'})
        }
        const products = JSON.parse(data)
        res.json(products);
    })
});

module.exports = router;