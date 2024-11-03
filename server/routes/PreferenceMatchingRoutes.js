const express = require('express')
const PreferenceMathcingRouter = express.Router();
const { preferenceMatching } = require('../controllers/PreferenceMatchingController');
PreferenceMathcingRouter
  .route('/')
  .post(preferenceMatching)

module.exports = PreferenceMathcingRouter