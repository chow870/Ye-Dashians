const express = require('express')
const PreferenceMathcingRouter = express.Router();
const { preferenceMatching } = require('../controllers/PreferenceMatchingController');
PreferenceFormSubmitRouter
  .route('/')
  .post(preferenceMatching)

module.exports = PreferenceMathcingRouter