const mongoose = require('mongoose');
const lobbyModel = require('./lobbyModel');
const preferenceSchema = mongoose.Schema({
    slotId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:lobbyModel
    },
      userId: {
        type: String,
        required: true,
        trim : true
      },
      preference:{
        type:Array,
        required: true,
      } 
});
const preferenceModel = mongoose.model('preferenceModel', preferenceSchema);
module.exports = preferenceModel;
// since i will be using require in the app4 file so i have to export like thin {only}