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

}