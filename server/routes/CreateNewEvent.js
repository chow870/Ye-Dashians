const express = require('express')
const CreateNewEventRouter = express.Router();
const { CreateNewEvent } = require('../controllers/CreateNewEventController');
CreateNewEventRouter
  .route('/')
  .post(CreateNewEvent)

module.exports = CreateNewEventRouter