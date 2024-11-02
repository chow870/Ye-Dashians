const express = require('express');
const { PlaceIdSearch } = require('../../controllers/MapsController/PlaceIdSearchController');
const PlaceIdSearchRouter = express.Router();

PlaceIdSearchRouter
  .route('/')
  .get(PlaceIdSearch)

module.exports = PlaceIdSearchRouter;