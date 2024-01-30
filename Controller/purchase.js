const Razorpay = require('razorpay');
const Order = require('../models/orders');


const premiumMembership = async (req, res) => {
    try {
        var rzp = new Razorpay({
            key_id: 'rzp_test_GGMFjCJ9lPLw6J',
            key_secret: 'cia9jlojQRy17AaRzpW4Wts6'
        })
        const amount = 2500;

        rzp.orders.create({amount, currency: "INR"}, (err, order) => {
            if(err) {
                throw new Error(JSON.stringify(err));
            }
            req.user.createOrder({ orderid: order.id, status: 'PENDING'}).then(() => {
                return res.status(201).json({ order, key_id : rzp.key_id});

            }).catch(err => {
                throw new Error(err)
            })
        })
    } catch(err){
        console.log(err);
        res.status(403).json({ message: 'Something went wrong', error: err})
    }
}

const updatetransactionstatus = async(req, res) => {
    try {
        const { payment_id, order_id} = req.body;
        const order = await Order.findOne({ where : { orderid: order_id}})
        const promise1 = order.update({ paymentid: payment_id, status: 'SUCCESSFUL'})
        const promise2 = req.user.update({ isPremium: true})
        Promise.all([promise1, promise2]).then(() => {
            return res.status(201).json({ success: true, message: "Transaction Successful"});
        }).catch((err) => {
                    throw new Error(err)
                })
            } catch (err) {
                console.log(err);
                res.status(403).json({ error: err, message: 'Something went wrong'})
            }
        }

const failedTransaction = async(req, res) => {
    try {
        const { payment_id, order_id } = req.body;
        const order = await Order.findOne({ where: { orderid: order_id }})
        const promise1 = order.update({ paymentid: payment_id, status: 'FAILED'})
        const promise2 = req.user.update({ isPremium: false})
        Promise.all([promise1, promise2]).then(() => {
            return res.status(200).json({ success: false, message: "Transaction Failed"})
        })
    } catch (err) {
        console.log(err);
         
    }
}

module.exports = {
    premiumMembership,
    updatetransactionstatus,
    failedTransaction
}