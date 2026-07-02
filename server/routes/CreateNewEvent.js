const express = require('express')
const CreateNewEventRouter = express.Router();
const { CreateNewEvent } = require('../controllers/CreateNewEventController');
const { protectRoute } = require('./AuthHelper');
const { isAuthorised } = require('../controllers/AuthController');

CreateNewEventRouter
  .route('/')
  .post(protectRoute, isAuthorised(['admin']), CreateNewEvent)

module.exports = CreateNewEventRouter