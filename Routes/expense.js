const express = require('express');

const expenseController = require('../Controller/expense');

const userAuthentication = require('../middleware/auth');

const router = express.Router();

router.post('/addExpense', userAuthentication.authenticate, expenseController.addExpense);

router.get('/getExpense', userAuthentication.authenticate, expenseController.getExpense);

router.delete('/deleteExpense/:id', userAuthentication.authenticate, expenseController.deleteExpense);

router.get('/download', userAuthentication.authenticate, expenseController.download)

router.get('/getDownloads', userAuthentication.authenticate, expenseController.getDownloads);

module.exports = router;