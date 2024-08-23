const express = require('express');
const path = require('path');
const fs = require('fs');
const { error } = require('console');
const e = require('express');
const router = express.Router();

const productsFilePath = path.join(__dirname, '../data/products.json')
const ordersFilePath = path.join(__dirname, '../data/orders.json')
const emailFilePath = path.join(__dirname, '../data/follower.json')


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
        const Orders = orders.filter(order => order.orderConfirmed);
        res.json(Orders);
    })
});

router.post(`/order`, (req, res) => {
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
            let existingOrder = orders.find(order => order.id == productId && !order.orderConfirmed);

            if (existingOrder) {
                existingOrder.quantity += quantity;
            } else {
                let newOrder = {
                    ...product,
                    orderConfirmed: false,
                    quantity: quantity,
                    orderDate: new Date().toLocaleString(),
                    orderId: new Date().toISOString().replace(/\D/g, '').slice(0, -3)
                };
                orders.push(newOrder);
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
    const { email } = req.body;
    
    fs.readFile(ordersFilePath, `utf8`, (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Unable to read orders file' });
        }

        let orders = JSON.parse(data);

        orders = orders.map(order => {
            if (!order.orderConfirmed) { 
                order.orderConfirmed = true;
                order.email = email;
            }
            return order;
        });

        fs.writeFile(ordersFilePath, JSON.stringify(orders), `utf8`, err => {
            if (err) {
                return res.status(500).json({ error: 'Unable to write to orders file' });
            }

            res.json({ message: 'Unconfirmed orders confirmed successfully' });
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
        const orderIndex = orders.findIndex(order => order.id == productId && !order.orderConfirmed);

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