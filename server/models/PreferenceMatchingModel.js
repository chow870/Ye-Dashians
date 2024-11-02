const mongoose = require('mongoose');
const lobbyModel = require('./lobbyModel');
const preferenceMatchingSchema = mongoose.Schema({
    slotId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:lobbyModel
    },
    userId: {
        type: String,
        required: true,
        trim : true
      },
      results:{
        type:Array,
        required: true,
      } 
});
const preferenceMatchingModel = mongoose.model('preferenceMatchingModel', preferenceMatchingSchema);
module.exports = preferenceMatchingModel ;
