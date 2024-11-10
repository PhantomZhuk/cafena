const express = require('express');
const path = require('path');
const router = express.Router();
const TelegramBot = require('node-telegram-bot-api');
const token = process.env.TOKEN;
const bot = new TelegramBot(token, { polling: true });
const admin_chat_id = process.env.CHAT_ID;
const mongoose = require('mongoose');
const multer = require('multer');
const { type } = require('os');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage: storage });

// const productsFilePath = path.join(__dirname, '../data/products.json')
// const unconfirmedOrdersFilePath = path.join(__dirname, '../data/unconfirmedOrders.json')
// const confirmedOrdersFilePath = path.join(__dirname, '../data/confirmedOrders.json')
// const emailFilePath = path.join(__dirname, './data/follower.json')

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
        let phone = callbackData.split('_')[2]
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
                let totalPrice = 0;
                let adminMessage = '';

                adminMessage = `User: ${userOrder.userName}\nPhone: ${userOrder.phone}\nOrder details:\n\n`;

                for (let product of userOrder.orders) {
                    adminMessage += `- Product Name: ${product.name}\n- Price: ${product.price}\n- Quantity: ${product.quantity}\n\n`;
                    totalPrice += product.price * product.quantity;
                }

                adminMessage += `Total Price: ${totalPrice}$`;

                bot.sendMessage(admin_chat_id, adminMessage);

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

const ProductSchema = new mongoose.Schema({
    filename: {
        type: String,
        required: true
    },
    path: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true
    }
})

const Product = mongoose.model('Product', ProductSchema);

router.get(`/`, async (req, res) => {
    const products = await Product.find();
    res.json(products);
});

const OrderSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    orders: {
        type: Array,
        required: true
    }
})

const Order = mongoose.model('Order', OrderSchema);

router.post(`/createOrder`, async (req, res) => {
    const { userName, phone, status, orders } = req.body
    if (!userName || !phone || !status || !orders) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const order = await Order.findOne({ userName, phone, status });
        let adminMessage = `User: ${userName}\nPhone: ${phone}\nOrder details:\n\n`;
        if (!order) {
            const newOrder = new Order({
                userName,
                phone,
                status,
                orders
            })

            orders.forEach(order => {
                adminMessage += `- Product Name: ${order.name}\n- Price: ${order.price}\n- Quantity: ${order.quantity}\n\n`;
            })

            await newOrder.save();
            res.send({ message: 'Order created' });
        } else {
            for (let product of orders) {
                let existingOrder = order.orders.find(o => o.name === product.name && o.id === product.id);
                if (existingOrder) {
                    existingOrder.quantity += product.quantity;
                    adminMessage += `- Product Name: ${existingOrder.name}\n- Price: ${existingOrder.price}\n- Quantity: ${existingOrder.quantity}\n\n`;
                } else {
                    order.orders.push(product);
                    adminMessage += `- Product Name: ${product.name}\n- Price: ${product.price}\n- Quantity: ${product.quantity}\n\n`;
                }
            }
            order.markModified('orders');

            await order.save();
            res.send({ message: 'Order updated' });
        }

        bot.sendMessage(admin_chat_id, adminMessage);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

router.get(`/orders`, async (req, res) => {
    const orders = await Order.find();
    res.json(orders);
});

// router.post('/order/changeStatus', (req, res) => {
//     const { phone, status, newStatus } = req.body;
//     console.log(phone, status, newStatus);

//     fs.readFile(unconfirmedOrdersFilePath, 'utf8', (err, data) => {
//         if (err) {
//             return res.status(500).json({ error: 'Unable to read orders file' });
//         }

//         let orders = JSON.parse(data);

//         let filteredOrder = orders.find(order =>
//             order.phone === phone && order.status === status
//         );

//         let isOrderWithNewStatusExist = orders.find(order =>
//             order.phone === phone && order.status === newStatus
//         );

//         if (!filteredOrder) {
//             return res.status(404).json({ error: 'Order not found' });
//         }

//         if (isOrderWithNewStatusExist) {
//             isOrderWithNewStatusExist.orders.push(...filteredOrder.orders);
//             orders = orders.filter(order => !(order.phone === phone && order.status === status));
//         } else {
//             filteredOrder.status = newStatus;
//         }

//         fs.writeFile(unconfirmedOrdersFilePath, JSON.stringify(orders), 'utf8', err => {
//             if (err) {
//                 return res.status(500).json({ error: 'Unable to write to orders file' });
//             }

//             res.json({ message: 'Order status changed successfully' });
//         });
//     });
// });

// router.post(`/order/confirm`, (req, res) => {
//     const { phone, name } = req.body;

//     fs.readFile(unconfirmedOrdersFilePath, `utf8`, (err, data) => {
//         if (err) {
//             return res.status(500).json({ error: 'Unable to read orders file' });
//         }

//         let orders = JSON.parse(data);

//         orders = orders.map(order => {
//             if (!order.orderConfirmed) {
//                 order.orderConfirmed = true;
//                 order.phone = phone;
//                 order.userName = name;
//             }
//             return order;
//         });

//         fs.writeFile(unconfirmedOrdersFilePath, JSON.stringify(orders), `utf8`, err => {
//             if (err) {
//                 return res.status(500).json({ error: 'Unable to write to orders file' });
//             }

//             res.json({ message: 'Unconfirmed orders confirmed successfully' });
//         });
//     });
// });

// router.post('/order/reduceNumber', (req, res) => {
//     const { productId, quantity } = req.body;

//     fs.readFile(unconfirmedOrdersFilePath, 'utf8', (err, data) => {
//         if (err) {
//             return res.status(500).json({ error: 'Unable to read orders file' });
//         }

//         const orders = JSON.parse(data);
//         const orderIndex = orders.findIndex(order => order.id == productId && !order.orderConfirmed);

//         if (orderIndex === -1) {
//             return res.status(404).json({ error: 'Order not found' });
//         }

//         let order = orders[orderIndex];
//         order.quantity -= quantity;

//         if (order.quantity <= 0) {
//             orders.splice(orderIndex, 1);
//         } else {
//             orders[orderIndex] = order;
//         }

//         fs.writeFile(unconfirmedOrdersFilePath, JSON.stringify(orders), 'utf8', err => {
//             if (err) {
//                 return res.status(500).json({ error: 'Unable to write to orders file' });
//             }

//             res.json({ message: 'Order updated successfully' });
//         });
//     });
// });

// router.get(`/list`, (req, res) => {
//     fs.readFile(unconfirmedOrdersFilePath, `utf8`, (err, data) => {
//         if (err) {
//             console.log(err);
//             res.status(500).json({ error: 'Unable to read product file' })
//         }
//         const products = JSON.parse(data)
//         res.json(products);
//     })
// });

module.exports = router;