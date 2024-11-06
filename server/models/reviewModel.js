const mongoose = require('mongoose')
const reviewSchema = mongoose.Schema({
    slotId:{
        type : String,
        required : true,
        trim : true
    },
    userId:{
        type : String,
        required : true,
        trim : true
    },
    userName:{
        type : String,
        required : true,
        trim : true
    },
    text:{
        type : String,
        required : true,
        trim : true
    },
    stars:{
        type : Number,
        required : true
    },
    placeId:{
        type : String,
        required : true,
        trim : true
    }
},{ timestamps: true });

// the name of the collecton will be reviews;
const reviewModel = mongoose.model('reviews' , reviewSchema)
module.exports = reviewModel;