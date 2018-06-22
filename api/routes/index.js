const express = require('express');
const router = express.Router();

const ctrlAuth = require('../controllers/auth.controller'); 

router
.route('/login')
.post(ctrlAuth.login);

router
.route('/register')
.post(ctrlAuth.register);

module.exports = router;