const express = require('express');
const router = express.Router();

const ctrlRecord = require('../controllers/records.controller');
const ctrlAuth = require('../controllers/auth.controller'); 

router
.route('/login')
.post(ctrlAuth.login);

router
.route('/register')
.post(ctrlAuth.register);

router
.route('/logout')
.get(ctrlAuth.authenticate, ctrlAuth.logout);

router
.route('/records')
.get(ctrlAuth.authenticate, ctrlRecord.getRecords);

module.exports = router;