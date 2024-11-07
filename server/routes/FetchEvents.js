const express = require('express')
const FetchEventsRouter = express.Router();

const { EventFetch } = require('../controllers/EventController');
FetchEventsRouter
  .route('/')
  .get(EventFetch)

module.exports = FetchEventsRouter