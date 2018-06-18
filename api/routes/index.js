const express = require('express');
const router = express.Router();

const ctrlReg = require('../controllers/regCtrl'); 

router
.route('/login')
.post(ctrlReg.login);

router
.route('/register')
.post(ctrlReg.register);

module.exports = router;