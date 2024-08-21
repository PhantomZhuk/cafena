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

router.get('/unformalizedOrders', (req, res) => {
    fs.readFile(ordersFilePath, 'utf8', (err, data) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ error: 'Unable to read orders file' });
        }

        const orders = JSON.parse(data);
        const unformalizedOrders = orders.filter(order => !order.orderConfirmed);

        res.json(unformalizedOrders);
    });
});


router.get(`/orders`, (req, res)=>{
    fs.readFile(ordersFilePath, `utf8`, (err, data)=>{
        if(err ){
            console.log(err);
            res.status(500).json({error: 'Unable to read product file'})
        }
        const orders = JSON.parse(data)
        res.json(orders);
    })
});

router.post(`/order`, (req, res) => {
    console.log('Received order request:', req.body); 
    const { productId, quantity } = req.body;

    fs.readFile(productsFilePath, `utf8`, (err, data) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ error: 'Unable to read product file' });
        }

        const products = JSON.parse(data);
        let product = products.find(el => el.id == productId);

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        fs.readFile(ordersFilePath, `utf8`, (err, data) => {
            if (err) {
                return res.status(500).json({ error: 'Unable to read orders file' });
            }

            const orders = JSON.parse(data);
            let existingOrder = orders.find(order => order.id == productId);

            if (existingOrder) {
                existingOrder.quantity += quantity;
            } else {
                product.orderConfirmed = false;
                product.quantity = quantity;
                product.orderDate = new Date().toLocaleString();
                product.orderId = new Date().toISOString().replace(/\D/g, '').slice(0, -3);
                orders.push(product);
            }

            fs.writeFile(ordersFilePath, JSON.stringify(orders), `utf8`, err => {
                if (err) {
                    return res.status(500).json({ error: 'Unable to write to orders file' });
                }

                res.json({ message: 'Order processed successfully' });
            });
        });
    });
});


router.post(`/order/confirm`, (req, res) => {
    const { orderId } = req.body;

    fs.readFile(ordersFilePath, `utf8`, (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Unable to read orders file' });
        }

        const orders = JSON.parse(data);
        let order = orders.find(order => order.orderId == orderId);

        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        order.orderConfirmed = true;

        fs.writeFile(ordersFilePath, JSON.stringify(orders), `utf8`, err => {
            if (err) {
                return res.status(500).json({ error: 'Unable to write to orders file' });
            }

            res.json({ message: 'Order confirmed successfully' });
        });
    });
});

router.post('/order/reduceNumber', (req, res) => {
    const { productId, quantity } = req.body;

    fs.readFile(ordersFilePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Unable to read orders file' });
        }

        const orders = JSON.parse(data);
        const orderIndex = orders.findIndex(order => order.id == productId);

        if (orderIndex === -1) {
            return res.status(404).json({ error: 'Order not found' });
        }

        let order = orders[orderIndex];
        order.quantity -= quantity;

        if (order.quantity <= 0) {
            orders.splice(orderIndex, 1);
        } else {
            orders[orderIndex] = order;
        }

        fs.writeFile(ordersFilePath, JSON.stringify(orders), 'utf8', err => {
            if (err) {
                return res.status(500).json({ error: 'Unable to write to orders file' });
            }

            res.json({ message: 'Order updated successfully' });
        });
    });
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