const { NightShelter, CheckBoxOutlineBlankSharp } = require('@mui/icons-material');
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
      },
      eventDetails: {
        type: Array,
        default: []
      },
      acceptedByUser2 :{
        type : Boolean,
        default : false
      }
});


lobbySchema.post( ['save', 'findOneAndUpdate', 'updateOne' , 'findOneAndDelete','findByIdAndUpdate'],async function(doc){
  if(global.io)
  {
    global.io.emit('lobby_updated')
  }
})

const lobbyModel = mongoose.model('lobby', lobbySchema);
module.exports = lobbyModel;
// since i will be using require in the app4 file so i have to export like thin {only}