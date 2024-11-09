const express = require('express')
const DeleteEventRouter = express.Router();
const { DeleteEvent } = require('../controllers/DeleteEventController');
DeleteEventRouter
  .route('/')
  .delete(DeleteEvent)

module.exports = DeleteEventRouter