const express = require('express')
const PreferenceFormSubmitRouter = express.Router();
const { preferenceSubmit } = require('../controllers/preferenceSubmissionController');
PreferenceFormSubmitRouter
  .route('/')
  .post(preferenceSubmit)

module.exports = PreferenceFormSubmitRouter