const express = require('express');

const purchaseController = require('../Controller/purchase')

const userAuthentication = require('../middleware/auth');

const router = express.Router();

router.get('/premiumMembership', userAuthentication.authenticate, purchaseController.premiumMembership);

router.post('/updatetransactionstatus', userAuthentication.authenticate, purchaseController.updatetransactionstatus);

router.post('/failedTransaction', userAuthentication.authenticate, purchaseController.failedTransaction);

module.exports = router;