const express = require('express')
const FetchCoordinatesRouter = express.Router();
const { FetchCoordinates } = require('../controllers/FetchCoordinatesController');
PreferenceFormSubmitRouter
  .route('/')
  .get(FetchCoordinates)

module.exports = FetchCoordinatesRouter