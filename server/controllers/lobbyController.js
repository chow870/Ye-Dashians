const lobbyModel = require('../models/lobbyModel')
module.exports.addLobby = async function addLobby(req, res) {
    console.log(req.body.creatorId)
    const newLobby = {
      user1: req.body.creatorId,
      user2: null,  // Setting user2 to null initially
      venue: null,   // Setting venue to null initially
      time: null     // Setting time to null initially
    };
  
    try {
      let mongoRes = await lobbyModel.create(newLobby);
      res.status(201).json({ message : "new lobby created", success: true, lobby: mongoRes });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
module.exports.joinLobby =  async function joinLobby(req,res){
    let lobbyId = req.body.lobbyId;
    let guest = req.body.guestId;
    try {
        let mongoRes = await lobbyModel.findOneAndUpdate(
            {_id : lobbyId} , 
            {user2 : guest} ,
            { new: true , returnDocument: 'after',
                upsert: false  }
        );
        if (!mongoRes) {
            res.status(500).json({ message : "such a lobby doesnt exist", success: false});
        }
        else
        {
            res.status(201).json({ message : "guest joined a lobby", success: true, lobby: mongoRes });
        }
        
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}
module.exports.getAllLobies = async function getAllLobies(req,res){

}

module.exports.getOneLobby = async function getOneLobby(req,res){
    let lobbyId = req.body.lobbyId;
    try {
        let mongoRes = await lobbyModel.findOneAndUpdate({_id : lobbyId});
        if (!mongoRes) {
            res.status(500).json({ message : "such a lobby doesnt exist", success: false});
        }
        else
        {
            res.status(201).json({ message : "guest joined a lobby", success: true, lobby: mongoRes });
        }
        
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}