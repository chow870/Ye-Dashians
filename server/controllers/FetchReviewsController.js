const mongoose = require('mongoose');
const reviewModel = require('../models/reviewModel');



const FetchReviews = async (req, res) => {
    try {
        const { place_id } = req.query;
        if (!place_id) {
            throw new Error("Please provide a place ID");
        }

        const reviews = await reviewModel.find({ placeId: place_id });

        if (reviews.length > 0) {
            return res.status(200).json({
                success: true,
                reviews: reviews,
            });
        } else {
            return res.status(404).json({
                success: false,
                message: "No reviews found for this place",
            });
        }

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

module.exports = { FetchReviews };
