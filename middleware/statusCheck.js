const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authenticate = (req, res, next) => {
    try {
        const token = req.header('Authorization');
        console.log(token);
        const user = jwt.verify(token, 'eyJhbGciOiJIUzI1NiJ9.eyJSb2xlIjoiQWRtaW4iLCJJc3N1ZXIiOiJJc3N1ZXIiLCJVc2VybmFtZSI6IkphdmFJblVzZSIsImV4cCI6MTcwNTEzOTk0OSwiaWF0IjoxNzA1MTM5OTQ5fQ.u17qfbQbdIbKM0Cw4yx_qqxu_SyYWNaFsN5ia1tsOdc');
        console.log('UserID >>>>',user.userId);
        req.userId = user.userId;
        req.name = user.name;
        User.findByPk(user.userId).then(user => {
            req.user = user;
            if(req.user.isPremium) {
                req.status = true
                next()
            } else {
                req.status = false
                next()
            }
            
        }).catch(err => { throw new Error(err)})
        

    } catch (err) {
        console.log(err);
        return res.status(401).json({ message: 'Failed to Authenticate'})
    }
}

module.exports = { authenticate }