const express = require('express')
const DeleteEventRouter = express.Router();
const { DeleteEvent } = require('../controllers/DeleteEventController');
const { protectRoute } = require('./AuthHelper');
const { isAuthorised } = require('../controllers/AuthController');

// controller reads req.params.id and the client calls /deleteEvent/:id,
// so the route must capture the id param (was '/', which never matched)
DeleteEventRouter
  .route('/:id')
  .delete(protectRoute, isAuthorised(['admin']), DeleteEvent)

module.exports = DeleteEventRouter