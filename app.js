const express = require('express');
const app = express();
const bodyParser = require('body-parser');
var cors = require('cors');
app.use(cors());

const sequelize = require('./util/database');
const User = require('./models/User')


app.use(bodyParser.json({ extended: false}));

app.post('/user/signup', async (req, res, next) => {
    try{
        const username = req.body.username;
        const email = req.body.email;
        const password = req.body.password;
        const data = await User.create( { username: username, email: email, password: password });
        res.status(201).json({reviewDetail: data});
        
        
    } catch(err) {
        res.status(500).json({ err: err});
    }
});



sequelize
.sync()
.then(result => {
    app.listen(3000);
}).catch(err => console.log(err));
