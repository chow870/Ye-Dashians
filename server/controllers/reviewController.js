const reviewModel = require('../models/reviewModel')

module.exports.createReview = async function createReview(req,res){
    const newReview = {
        slotId : req.body.slotId,
        userId : req.body.userId, 
        userName : req.body.userName,
        text : req.body.text,
        stars : req.body.stars,
        placeId : req.body.placeId
    }
    console.log(newReview)
    try {
        const mongoRes = await reviewModel.create(newReview);
        res.status(201).json({ message : "new review posted", success: true, review: mongoRes });
    } catch (error) {
        res.status(500).json({
            message : error.message , success: false
        })
    }
}

module.exports.deleteReview = async function deleteReview(req,res){
    // since a delete restApi must not have a body so will use rquest queries to send data
    const {reviewId} = req.query;
    try {
        const MongoRes = await reviewModel.findOneAndDelete({_id:reviewId});
        res.json({
            message:"review deleted successFully"
        })
    } catch (error) {
        res.json({
            message : "some error ocurred in deleting the review" ,
            err : error
        })
    }
}

module.exports.updateReview = async function updateReview(req,res){
    const { reviewId } = req.body;
    // only allow editing the mutable fields of a review
    const updates = {};
    if (req.body.text !== undefined) updates.text = req.body.text;
    if (req.body.stars !== undefined) updates.stars = req.body.stars;

    try {
        if (!reviewId) {
            return res.status(400).json({ success: false, message: "reviewId is required" });
        }
        const updated = await reviewModel.findByIdAndUpdate(reviewId, updates, { new: true, runValidators: true });
        if (!updated) {
            return res.status(404).json({ success: false, message: "review not found" });
        }
        return res.json({ success: true, message: "review updated successfully", review: updated });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}