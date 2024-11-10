const express = require('express');
const {sendMail} = require('../controllers/MailController/nodemailer')
const mailrouter = express.Router();
mailrouter
    .route('/send')
    .post(sendMail);
module.exports = mailrouter;