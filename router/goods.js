const express = require('express');
const path = require('path');
const fs = require('fs');
const { error } = require('console');
const e = require('express');
const router = express.Router();
const TelegramBot = require('node-telegram-bot-api');
const token = process.env.TOKEN;
const bot = new TelegramBot(token, { polling: true });
const admin_chat_id = process.env.CHAT_ID;

const productsFilePath = path.join(__dirname, '../data/products.json')
const unconfirmedOrdersFilePath = path.join(__dirname, '../data/unconfirmedOrders.json')
const confirmedOrdersFilePath = path.join(__dirname, '../data/confirmedOrders.json')
const emailFilePath = path.join(__dirname, './data/follower.json')

bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    if (chatId != admin_chat_id) {
        bot.sendMessage(chatId, 'Welcome! Select an action to continue.', {
            reply_markup: {
                inline_keyboard: [
                    [
                        {
                            text: 'Start confirmation',
                            callback_data: 'start_confirmation'
                        }
                    ]
                ]
            }
        });
    } else if (chatId == admin_chat_id) {
        bot.sendMessage(admin_chat_id, 'Administrator mode is enabled!');
    }

});

bot.on('callback_query', (callbackQuery) => {
    const msg = callbackQuery.message;
    const chatId = msg.chat.id;

    if (callbackQuery.data === 'start_confirmation') {
        bot.sendMessage(chatId, `Please send your contact to confirm your order.`, {
            reply_markup: {
                keyboard: [
                    [
                        {
                            text: 'Send my contact',
                            request_contact: true
                        }
                    ]
                ],
                one_time_keyboard: true
            }
        });
    } else if (callbackQuery.data === 'contacts') {
        bot.sendMessage(chatId, 'Here are our contacts...');
    }

    bot.answerCallbackQuery(callbackQuery.id);
});

bot.on('contact', (msg) => {
    const chatId = msg.chat.id;
    const contact = msg.contact;

    if (contact) {
        let userPhoneNumber = contact.phone_number;
        let formattedPhoneNumber = `+${userPhoneNumber}`;
        fs.readFile(unconfirmedOrdersFilePath, 'utf8', (err, data) => {
            if (err) {
                console.log(err);
                return bot.sendMessage(chatId, 'Unable to read product file.');
            }
            const orders = JSON.parse(data);

            const ordersUnconfirmed = orders.filter(o => o.status === 'unconfirmed' && (o.phone === formattedPhoneNumber || o.phone === userPhoneNumber));

            let message = '';
            let totalPrice = 0;

            for (let el of ordersUnconfirmed) {
                for (let order of el.orders) {
                    message += `Name: ${order.name}\nQuantity: ${order.quantity}\nPrice: ${order.price}$\n\n`;
                    totalPrice += order.price * order.quantity;
                }
            }

            if (message !== '') {
                message += `Total Price: ${totalPrice}$`;
                bot.sendMessage(chatId, 'Below is a list of your unconfirmed orders:');
                bot.sendMessage(chatId, message, {
                    reply_markup: {
                        inline_keyboard: [
                            [
                                {
                                    text: 'Confirm order',
                                    callback_data: `confirm_order_${formattedPhoneNumber}`
                                }
                            ]
                        ]
                    }
                });
            } else {
                bot.sendMessage(chatId, 'No unconfirmed orders found.');
            }
        });
    } else {
        bot.sendMessage(chatId, 'Failed to receive contact. Please try again.');
    }
});

bot.on('callback_query', (callbackQuery) => {
    const chatId = callbackQuery.message.chat.id;
    const callbackData = callbackQuery.data; 

    if (callbackData.startsWith('confirm_order_')) {
        let phone = callbackData.split('_')[2].slice(1);
        console.log(phone);

        fs.readFile(unconfirmedOrdersFilePath, 'utf8', (err, fileData) => { 
            if (err) {
                console.log(err);
                return bot.sendMessage(chatId, 'Unable to read orders file.');
            }

            let orders = JSON.parse(fileData);
            let userOrder = orders.find(o => o.phone === phone && o.status === 'unconfirmed');
            console.log(userOrder);

            if (userOrder) {
                userOrder.status = 'confirmed';

                fs.writeFile(unconfirmedOrdersFilePath, JSON.stringify(orders), 'utf8', (err) => {
                    if (err) {
                        console.log(err);
                        return bot.sendMessage(chatId, 'Unable to update order status.');
                    }

                    bot.sendMessage(chatId, 'Your order has been confirmed!');
                });
            }
        });
    }
});



router.get(`/`, (req, res) => {
    fs.readFile(productsFilePath, `utf8`, (err, data) => {
        if (err) {
            console.log(err);
            res.status(500).json({ error: 'Unable to read product file' })
        }
        const products = JSON.parse(data)
        res.json(products);
    })
});

router.get(`/orders`, (req, res) => {
    fs.readFile(unconfirmedOrdersFilePath, `utf8`, (err, data) => {
        if (err) {
            console.log(err);
            res.status(500).json({ error: 'Unable to read product file' })
        }
        const orders = JSON.parse(data)
        const Orders = orders.filter(order => !order.orderConfirmed);
        res.json(Orders);
    })
});


router.post(`/order`, (req, res) => {
    const { cart } = req.body;

    fs.readFile(unconfirmedOrdersFilePath, `utf8`, (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Unable to read orders file' });
        }

        let orders = JSON.parse(data);
        let totalPrice = 0;
        let adminMessage = '';
        let order_id;

        for (let order of cart) {
            let existingUser = orders.find(o => o.phone === order.phone && o.status === 'unconfirmed');

            let newOrderDetails = {
                price: order.price,
                img: order.img,
                name: order.name,
                quantity: order.quantity,
                orderDate: new Date().toLocaleString(),
                orderId: new Date().toISOString().replace(/\D/g, '').slice(0, -3),
            };

            if (existingUser) {
                existingUser.orders = existingUser.orders || [];
                let existingProduct = existingUser.orders.find(o => o.name === newOrderDetails.name);

                if (existingProduct) {
                    existingProduct.quantity += newOrderDetails.quantity;
                } else {
                    existingUser.orders.push(newOrderDetails);
                }
            } else {
                let newOrder = {
                    userName: order.userName,
                    phone: order.phone,
                    status: 'unconfirmed',
                    order_id : new Date().toISOString().replace(/\D/g, '').slice(0, -3),
                    orders: [newOrderDetails]
                };
                orders.push(newOrder);
            }

            let currentOrders = existingUser ? existingUser.orders : [newOrderDetails];

            adminMessage = `User: ${order.userName}\nPhone: ${order.phone}\nOrder details:\n\n`;
            order_id = order.order_id;;

            for (let product of currentOrders) {
                adminMessage += `- Product Name: ${product.name}\n- Price: ${product.price}\n- Quantity: ${product.quantity}\n\n`;
                totalPrice += product.price * product.quantity;
            }
        }

        adminMessage += `Total Price: ${totalPrice}$`;

        bot.sendMessage(admin_chat_id, adminMessage);

        fs.writeFile(unconfirmedOrdersFilePath, JSON.stringify(orders), `utf8`, err => {
            if (err) {
                return res.status(500).json({ error: 'Unable to write to orders file' });
            }

            res.json({ message: 'Order processed successfully' });
        });
    });
});





router.post('/order/changeStatus', (req, res) => {
    const { phone, status, newStatus } = req.body;
    console.log(phone, status, newStatus);

    fs.readFile(unconfirmedOrdersFilePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Unable to read orders file' });
        }

        let orders = JSON.parse(data);

        let filteredOrder = orders.find(order =>
            order.phone === phone && order.status === status
        );

        let isOrderWithNewStatusExist = orders.find(order =>
            order.phone === phone && order.status === newStatus
        );

        if (!filteredOrder) {
            return res.status(404).json({ error: 'Order not found' });
        }

        if (isOrderWithNewStatusExist) {
            isOrderWithNewStatusExist.orders.push(...filteredOrder.orders);
            orders = orders.filter(order => !(order.phone === phone && order.status === status));
        } else {
            filteredOrder.status = newStatus;
        }

        fs.writeFile(unconfirmedOrdersFilePath, JSON.stringify(orders), 'utf8', err => {
            if (err) {
                return res.status(500).json({ error: 'Unable to write to orders file' });
            }

            res.json({ message: 'Order status changed successfully' });
        });
    });
});

router.post(`/order/confirm`, (req, res) => {
    const { phone, name } = req.body;

    fs.readFile(unconfirmedOrdersFilePath, `utf8`, (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Unable to read orders file' });
        }

        let orders = JSON.parse(data);

        orders = orders.map(order => {
            if (!order.orderConfirmed) {
                order.orderConfirmed = true;
                order.phone = phone;
                order.userName = name;
            }
            return order;
        });

        fs.writeFile(unconfirmedOrdersFilePath, JSON.stringify(orders), `utf8`, err => {
            if (err) {
                return res.status(500).json({ error: 'Unable to write to orders file' });
            }

            res.json({ message: 'Unconfirmed orders confirmed successfully' });
        });
    });
});


router.post('/order/reduceNumber', (req, res) => {
    const { productId, quantity } = req.body;

    fs.readFile(unconfirmedOrdersFilePath, 'utf8', (err, data) => {
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

        fs.writeFile(unconfirmedOrdersFilePath, JSON.stringify(orders), 'utf8', err => {
            if (err) {
                return res.status(500).json({ error: 'Unable to write to orders file' });
            }

            res.json({ message: 'Order updated successfully' });
        });
    });
});



router.get(`/list`, (req, res) => {
    fs.readFile(unconfirmedOrdersFilePath, `utf8`, (err, data) => {
        if (err) {
            console.log(err);
            res.status(500).json({ error: 'Unable to read product file' })
        }
        const products = JSON.parse(data)
        res.json(products);
    })
});

module.exports = router;