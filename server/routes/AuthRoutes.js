const express = require('express')
const userModel = require('../models/userModel');
const authRouter = express.Router()
const {loginUser,signupUser,forgotPassword,resetPassword,logout} = require('../controllers/AuthController')


// routes
authRouter
.route('/login')
.post(loginUser)

authRouter
 .route('/signup')
 .post(signupUser)

authRouter
  .route('/forgotPassword')
  .post(forgotPassword)

authRouter  
  .route('/resetPassword/:token')
  .post(resetPassword)

authRouter
  .route('/logout')
  .get(logout)

// exporting
module.exports = authRouter