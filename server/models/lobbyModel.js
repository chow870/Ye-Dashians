const mongoose = require('mongoose');
const lobbySchema = mongoose.Schema({
      user1: {
        type: String,
        required: true,
        trim : true
      },
      user2: {
        type: String,
        // not making these requried true becuase create karte samay se sab kuch mere pas nhi rhega 
        default: null,
        trim : true
      },
      venue: {
        type: String,
        default: null,
      },
      venueId:{
        type: String,
        default: null,
      },
      venueCoordinates :{
        type:Array,
        default:null
      },
      time: {
        type: Date,
        default: null,
      }
});
const lobbyModel = mongoose.model('userModel', lobbySchema);
module.exports = lobbyModel;
// since i will be using require in the app4 file so i have to export like thin {only}