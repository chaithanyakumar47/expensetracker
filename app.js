const express = require('express');
const app = express();
const bodyParser = require('body-parser');
var cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const jwtDecode = require('jwt-decode');
const Razorpay = require('razorpay');
app.use(cors());

const sequelize = require('./util/database');
const User = require('./models/User')
const Expense = require('./models/Expenses');
const Order = require('./models/orders');
const userAuthentication = require('./middleware/auth')
const statusCheck = require('./middleware/statusCheck');


app.use(bodyParser.json({ extended: false}));

function generateAccessToken(id, name, premiumRequest) {
    if (!premiumRequest){
        return jwt.sign({ userId: id, name: name }, 'eyJhbGciOiJIUzI1NiJ9.eyJSb2xlIjoiQWRtaW4iLCJJc3N1ZXIiOiJJc3N1ZXIiLCJVc2VybmFtZSI6IkphdmFJblVzZSIsImV4cCI6MTcwNTEzOTk0OSwiaWF0IjoxNzA1MTM5OTQ5fQ.u17qfbQbdIbKM0Cw4yx_qqxu_SyYWNaFsN5ia1tsOdc')
    } else {
        return jwt.sign({ userId: id, name: name, premiumUser: true }, 'eyJhbGciOiJIUzI1NiJ9.eyJSb2xlIjoiQWRtaW4iLCJJc3N1ZXIiOiJJc3N1ZXIiLCJVc2VybmFtZSI6IkphdmFJblVzZSIsImV4cCI6MTcwNTEzOTk0OSwiaWF0IjoxNzA1MTM5OTQ5fQ.u17qfbQbdIbKM0Cw4yx_qqxu_SyYWNaFsN5ia1tsOdc')
    }
    
    
}


app.post('/user/signup', async (req, res, next) => {
    try{
        const username = req.body.username;
        const email = req.body.email;
        const password = req.body.password;
        bcrypt.hash(password, 10, async(err, hash) => {
            console.log(err);
            const data = await User.create( { username: username, email: email, password: hash });
            res.status(201).json(data);
        })

        
        
    } catch(err) {
        res.status(403).json({ err: err});
    }
});

app.post('/user/login', async (req, res, next) => {
    try{
        const email = req.body.email;
        const password = req.body.password;
        const emailCheck = await User.findAll({ where : {email: email}});
        if (emailCheck.length > 0){
            bcrypt.compare(password, emailCheck[0].password, (err, result) => {
                if(err) {
                    throw new Error('Something went wrong')
                }
                if(result === true) {
                    res.status(200).json({ status: true, message: 'Logged in Successfully', token: generateAccessToken(emailCheck[0].id, emailCheck[0].username, false)});
                }
                else {
                    return res.status(400).json({ status: false, message: 'Password is incorrect'})
                }
            })
        }else {
            res.status(404).json({ status: false, message: 'User does not exist'})
        }
        
    } 
    catch(err) {
        res.status(404).json({err: err});
    }    
})

app.post('/expense/addExpense', userAuthentication.authenticate, async (req, res) => {
    try{
        const description = req.body.description;
        const amount = req.body.amount;
        const category = req.body.category
        const userId = req.user.id
        const details = await Expense.create({ description: description, amount: amount, category: category, userId: userId});
        res.status(201).json(details)
    } catch (err) {
        res.json(err);
    }
})

app.get('/expense/getExpense', userAuthentication.authenticate, async (req, res) => {
    try {
        // const data = await Expense.findAll({ where: { userId: req.user.id}});
        const data = await req.user.getExpenses();
        res.status(200).json(data);
    } catch(err) {
        res.json(err);
        console.log(err)
    }
})

app.delete('/expense/deleteExpense/:id', userAuthentication.authenticate, async (req, res) => {
    try {
        const userId = req.user.id
        const id = req.params.id;
        await Expense.destroy({
            where : {
                id: id,
                userId: userId
            }
        })
        res.status(200).json({ message: 'Expense Deleted'});
    } catch (err) {
        res.status(500).json(err);
    }
})


app.get('/purchase/premiumMembership',userAuthentication.authenticate,  async (req, res) => {
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
})

app.post('/purchase/updatetransactionstatus', userAuthentication.authenticate, async(req, res) => {
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
);

app.post('/purchase/failedTransaction', userAuthentication.authenticate, async(req, res) => {
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
})

app.get('/setPremium', userAuthentication.authenticate, async(req, res) => {
    try {
        const userId = req.userId;
        const name = req.name;
        const token = generateAccessToken(userId, name, true);
        res.status(201).json({ token: token});
    } catch (err) {
        console.log(err)
    }
})

app.get('/checkPremium', statusCheck.authenticate, async(req, res) => {
    try {
        if (req.status === true) {
            res.status(200).json({ success: true})
        } else {
            res.status(200).json({ success: false})
        }
    } catch (err) {
        console.log(err);
    }
})

app.get('/premium/showLeaderboard', userAuthentication.authenticate, async (req, res) =>{
    try {
        const leaderboardofusers = await User.findAll({
            attributes: ['id', 'username',[sequelize.fn('sum', sequelize.col('expenses.amount')), 'total_cost'] ],
            include: [
                {
                    model: Expense,
                    attributes: []
                }
            ],
            group: ['user.id'],
            order: [['total_cost', 'DESC']]
        })
        res.status(200).json(leaderboardofusers)
    } catch (err) {
        console.log(err)
        res.status(500).json(err)
    }
})

User.hasMany(Expense);
Expense.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);


sequelize
.sync()
.then(result => {
    app.listen(3000);
}).catch(err => console.log(err));
