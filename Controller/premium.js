const User = require('../models/User');
const jwt = require('jsonwebtoken');

function generateAccessToken(id, name, premiumRequest) {
    if (!premiumRequest){
        return jwt.sign({ userId: id, name: name }, 'eyJhbGciOiJIUzI1NiJ9.eyJSb2xlIjoiQWRtaW4iLCJJc3N1ZXIiOiJJc3N1ZXIiLCJVc2VybmFtZSI6IkphdmFJblVzZSIsImV4cCI6MTcwNTEzOTk0OSwiaWF0IjoxNzA1MTM5OTQ5fQ.u17qfbQbdIbKM0Cw4yx_qqxu_SyYWNaFsN5ia1tsOdc')
    } else {
        return jwt.sign({ userId: id, name: name, premiumUser: true }, 'eyJhbGciOiJIUzI1NiJ9.eyJSb2xlIjoiQWRtaW4iLCJJc3N1ZXIiOiJJc3N1ZXIiLCJVc2VybmFtZSI6IkphdmFJblVzZSIsImV4cCI6MTcwNTEzOTk0OSwiaWF0IjoxNzA1MTM5OTQ5fQ.u17qfbQbdIbKM0Cw4yx_qqxu_SyYWNaFsN5ia1tsOdc')
    }
    
    
}


const setPremium = async(req, res) => {
    try {
        const userId = req.userId;
        const name = req.name;
        const token = generateAccessToken(userId, name, true);
        res.status(201).json({ token: token});
    } catch (err) {
        console.log(err)
    }
}

const checkPremium = async(req, res) => {
    try {
        if (req.status === true) {
            res.status(200).json({ success: true})
        } else {
            res.status(200).json({ success: false})
        }
    } catch (err) {
        console.log(err);
    }
}


const showLeaderboard = async (req, res) =>{
    try {
        const leaderboardofusers = await User.findAll({

            order: [['totalExpenses', 'DESC']]
        })
        res.status(200).json(leaderboardofusers)
    } catch (err) {
        console.log(err)
        res.status(500).json(err)
    }
}

module.exports = {
    setPremium,
    checkPremium,
    showLeaderboard
}