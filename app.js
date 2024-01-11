const express = require('express');
const app = express();
const bodyParser = require('body-parser');
var cors = require('cors');
const bcrypt = require('bcrypt');
app.use(cors());

const sequelize = require('./util/database');
const User = require('./models/User')


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
                    res.status(200).json({message: 'Logged in Successfully'});
                }
                else {
                    return res.status(400).json({message: 'Password is incorrect'})
                }
            })
        }else {
            res.status(404).json({message: 'User does not exist'})
        }
        
    } 
    catch(err) {
        res.status(404).json({err: err});
    }    
})



sequelize
.sync()
.then(result => {
    app.listen(3000);
}).catch(err => console.log(err));
