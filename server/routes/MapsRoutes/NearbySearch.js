const express = require('express');
const { NearbySearch } = require('../../controllers/MapsController/NearbySearchController');
const NearbySearchRouter = express.Router();

NearbySearchRouter
  .route('/')
  .get(NearbySearch)

module.exports = NearbySearchRouter