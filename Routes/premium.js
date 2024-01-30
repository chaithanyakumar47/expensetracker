const express = require('express');

const premiumController = require('../Controller/premium');

const userAuthentication = require('../middleware/auth');
const statusCheck = require('../middleware/statusCheck');

const router = express.Router();

router.get('/setPremium', userAuthentication.authenticate, premiumController.setPremium);

router.get('/checkPremium', statusCheck.authenticate, premiumController.checkPremium);

router.get('/showLeaderboard', userAuthentication.authenticate, premiumController.showLeaderboard);

module.exports = router;