const express = require('express')
const PreferenceMathcingRouter = express.Router();
const { preferenceMatching, deletePreferenceMatching } = require('../controllers/PreferenceMatchingController');
PreferenceMathcingRouter
  .route('/')
  .post(preferenceMatching)
  // in delete method=> no body thats why using query params 
  .delete(deletePreferenceMatching)
module.exports = PreferenceMathcingRouter