const express = require('express')
const FetchOtherPreferenceRouter = express.Router();
const { FetchOtherPreference } = require('../controllers/FetchOtherPreferenceController');
FetchOtherPreferenceRouter
  .route('/')
  .get(FetchOtherPreference)

module.exports = FetchOtherPreferenceRouter