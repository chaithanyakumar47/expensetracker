const userAuthentication = require('../middleware/auth');
const passwordController = require('../Controller/password')
const express = require('express');
const router = express.Router();

router.post('/forgotpassword', userAuthentication.authenticate, passwordController.forgotpassword);

router.get('/resetpassword/:uuid', userAuthentication.authenticate, passwordController.resetpassword);

router.get('/updatepassword/:id', userAuthentication.authenticate, passwordController.updatepassword);

module.exports = router;