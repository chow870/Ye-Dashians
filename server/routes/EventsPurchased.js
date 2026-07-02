const express = require('express')
const EventsPurchasedRouter = express.Router();
const { EventsPurchased } = require('../controllers/EventsPurchasedController');
const { protectRoute } = require('./AuthHelper');

EventsPurchasedRouter.use(protectRoute);
EventsPurchasedRouter
  .route('/')
  .get(EventsPurchased)

module.exports = EventsPurchasedRouter