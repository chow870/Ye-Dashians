const lobbyModel = require('../models/lobbyModel')
module.exports.addLobby = async function addLobby(req, res) {
    console.log("reached the addLobby backend")
    console.log(req.body.creatorId)
    const newLobby = {
      user1: req.body.creatorId,
      user2: null,  // Setting user2 to null initially
      venue: null,   // Setting venue to null initially
      time: req?.body?.eventDetails?.time ?? null,
      eventDetails : req.body.eventDetails
    };
  
    try {
      let mongoRes = await lobbyModel.create(newLobby);
      console.log("succesfully created the lobby : ", mongoRes)
      res.status(201).json({ message : "new lobby created", success: true, lobby: mongoRes });

    } catch (error) {
        console.log("errro in creation of the lobby, controller addLobby")
        console.log(error)
      res.status(500).json({ success: false, message: error.message });
    }
  }
module.exports.joinLobby =  async function joinLobby(req,res){
    let lobbyId = req.body.lobbyId;
    let guest = req.body.guestId;
    let status = req.body.acceptedByUser2;
    try {
        let mongoRes = await lobbyModel.findOneAndUpdate(
            {_id : lobbyId} , 
            {user2 : guest , acceptedByUser2 : status} ,
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

module.exports.acceptByUser2 = async function(req,res){
    try{
        const myId = req.id;
        const lobbyId = req.body.lobbyId;
        const lobby = await lobbyModel.findById(lobbyId);
        if(lobby.user2!=myId)
        {
            throw new Error('only user2 can accept the invitation');
        }
        let updatedLobby = await lobbyModel.findByIdAndUpdate(lobbyId,{acceptedByUser2:true},{runValidators:false,new:true})
        if(updatedLobby)
        {
            return res.json({
                success : true,
                message : "user 2 accepted successfully",
                data : updatedLobby
            })
        }
        else
        {
            return res.json({
                success : false,
                message : `error while accepting by user 2 `
            })
        }
    }catch(err)
    {
        return res.json({
            success : false,
            message : `error while accepting by user 2 , ${err.message}`
        })
    }
}

module.exports.getAllLobies = async function getAllLobies(req,res){
    try {
        let mongoRes = await lobbyModel.find();
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

// module.exports.getOneLobby = async function getOneLobby(req,res){
//     let lobbyId = req.body.lobbyId;
//     try {
//         let mongoRes = await lobbyModel.findOne({_id : lobbyId});
//         if (!mongoRes) {
//             res.status(500).json({ message : "such a lobby doesnt exist", success: false});
//         }
//         else
//         {
//             res.status(201).json({ message : "found a lobby , giving it to you", success: true, lobby: mongoRes });
//         }
        
//     } catch (error) {
//         res.status(500).json({ success: false, message: error.message });
//     }
// }

module.exports.updateLobby =  async function updateLobby(req,res){
    let lobbyId = req.body.lobbyId;
    try {
        
        let updateObj = {
            venue: req.body.venue,
            venueId: req.body.venueId,
            time: req.body.time,
            venueCoordinates: req.body.venCords
        };

        if (req.body.user1 !== undefined) {
            updateObj.user1 = req.body.user1;
        }
        if (req.body.user2 !== undefined) {
            updateObj.user2 = req.body.user2;
        }

       let mongoRes = await lobbyModel.findOneAndUpdate(
            { _id: lobbyId },
            updateObj,
            { new: true, returnDocument: 'after', upsert: false }
        );
        if (!mongoRes) {
            res.status(500).json({ message : "such a lobby doesnt exist", success: false});
        }
        else
        {
            res.status(201).json({ message : "updated a lobby", success: true, lobby: mongoRes });
        }
        
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

module.exports.deleteLobby = async function deleteLobby(req,res){
    try {
        const {slotId} = req.query
        const idToDelete = slotId;
        console.log("i am from delete lobby" , idToDelete)
        if (!idToDelete) {
            throw new Error("Please provide a slot ID");
        }
        
        const deletedPreference = await lobbyModel.findOneAndDelete({ _id: idToDelete });
        
        if (deletedPreference) {
            return res.status(200).json({
                message: "Lobby deleted successfully"
            });
        } else {
            return res.status(200).json({
                success: true,
                message: "Lobby not found"
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}