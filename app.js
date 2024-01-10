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
        const emailData = await User.findAll({ where: { email: email}});
        // if(emailData.length < 1){
            // const data = await User.create( { username: username, email: email, password: password });
            // res.status(201).json({reviewDetail: data});
        // } else{
        //     const status = "Email Already Resgistered";
        //     res.json({details: status});
        // }
            const data = await User.create( { username: username, email: email, password: password });
            res.status(201).json({reviewDetail: data});

        
        
    } catch(err) {
        res.json({ err: err});
    }
});



sequelize
.sync()
.then(result => {
    app.listen(3000);
}).catch(err => console.log(err));
