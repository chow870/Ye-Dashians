const express = require('express')
const reviewRouter = express.Router();
const {createReview , deleteReview , updateReview} = require('../controllers/reviewController')

reviewRouter
    .route('/createNew')
    .post(createReview)
reviewRouter
    .route('/delete')
    .delete(deleteReview)
reviewRouter
    .route('/update') 
    .patch(updateReview)   

module.exports = reviewRouter;