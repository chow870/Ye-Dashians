const express = require('express');
const { FetchReviews } = require('../controllers/FetchReviewsController');
const FetchReviewRouter = express.Router();

FetchReviewRouter
  .route('/')
  .get(FetchReviews)

module.exports = FetchReviewRouter