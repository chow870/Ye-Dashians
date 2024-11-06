const express = require('express');
const { WaetherSearch } = require('../../controllers/MapsController/Aqi');
const WeatherSearchRouter = express.Router();

WeatherSearchRouter
  .route('/')
  .get(WaetherSearch)

module.exports = WeatherSearchRouter