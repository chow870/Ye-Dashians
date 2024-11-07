const express = require('express')
const EventsPurchasedRouter = express.Router();
const { EventsPurchased } = require('../controllers/EventsPurchasedController');
EventsPurchasedRouter
  .route('/')
  .get(EventsPurchased)

module.exports = EventsPurchasedRouter