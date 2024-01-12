const express = require('express');
const app = express();
const bodyParser = require('body-parser');
var cors = require('cors');
const bcrypt = require('bcrypt');
app.use(cors());

const sequelize = require('./util/database');
const User = require('./models/User')
const Expense = require('./models/Expenses');


app.use(bodyParser.json({ extended: false}));

app.post('/user/signup', async (req, res, next) => {
    try{
        const username = req.body.username;
        const email = req.body.email;
        const password = req.body.password;
        bcrypt.hash(password, 10, async(err, hash) => {
            console.log(err);
            const data = await User.create( { username: username, email: email, password: hash });
            res.status(201);
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
                    res.status(200).json({ status: true, message: 'Logged in Successfully'});
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

app.post('/expense/addExpense', async (req, res) => {
    try{
        const description = req.body.description;
        const amount = req.body.amount;
        const category = req.body.category
        const details = await Expense.create({ description: description, amount: amount, category: category});
        res.status(201).json(details)
    } catch (err) {
        res.json(err);
    }
})

app.get('/expense/getExpense', async (req, res) => {
    try {
        const data = await Expense.findAll();
        res.json(data);
    } catch(err) {
        res.json(err);
    }
})

app.delete('/expense/deleteExpense/:id', async (req, res) => {
    try {
        const id = req.params.id;
        await Expense.destroy({
            where : {
                id: id
            }
        })
    } catch (err) {
        console.log(err)
    }
})

// User.hasMany(Expense);
// Expense.belongsTo(User);


sequelize
.sync()
.then(result => {
    app.listen(3000);
}).catch(err => console.log(err));
