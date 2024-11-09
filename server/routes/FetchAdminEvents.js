const express = require('express')
const FetchAdminEventsRouter = express.Router();
const { FetchAdminEvents } = require('../controllers/FetchAdminEvents');
FetchAdminEventsRouter
  .route('/')
  .get(FetchAdminEvents)

module.exports = FetchAdminEventsRouter