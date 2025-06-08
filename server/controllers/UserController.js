

const userModel = require('../models/userModel')
module.exports.getUsers = async function getUsers(req, res) {
  try {
    let allUsers = await userModel.find();
    res.json({
      success : true,
      message: "User data fetched",
      data: allUsers
    });
  } catch (error) {
    return res.status(500).json({
      success : false,
      message: `err in fetching users ${err.message}`
    });
  }
};



module.exports.getOneUser = async function getOneUser(req, res) {
  
  let id
  if(req.params.id==="me") id = req.id;
  else id = req.params.id
  try {
    let thatOneUser = await userModel.findById(id);
    if (thatOneUser) {
      // console.log("yaha aagya")
      return res.json({
        success: true,
        message: "user has been fetched",
        data: thatOneUser
      })
    }
    else {
      return res.json({
        success: false,
        message: "the user doesnt exist"
      })
    }
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: `err in fetching user by id ${err.message}`
    });
  }
}



module.exports.addUser = async function addUser(req, res) {
  let obj = req.body;
  let mongoRes = await userModel.create(obj);
  res.json({
    message: "New user created",
    data: obj
  });
}



module.exports.updateUser = async function updateUser(req, res) {
  try {
    let id = req.params.id;
    let dataToBeUpdated = req.body;
    let updatedUserData = await userModel.findByIdAndUpdate(id,dataToBeUpdated,  { runValidators: false , new: true })
    // runvalidators was false because confirmPassword field
    // which is one of the required fields is missing in our db docs
    // also new is true because we want the updated data
    if(updatedUserData)
    {
      return res.json({
        message : "the user was updated",
        updatedData : updatedUserData
      })
    }
    else
    {
      return res.json({
        message : "the user couldnt be updated"
      })
    }
  } catch (err) {
    return res.status(500).json({
      message: `err in updating user ${err.message}`
    });
  }

}



module.exports.deleteUser = async function deleteUser(req, res) {
  try {
    let idToDelete = req.params.id;
    let userToDelete = await userModel.findByIdAndDelete(idToDelete);
    // jab ham delete karte hai toh woh delete hone waala item haamre paas aata hai
    if (userToDelete) {
      return res.json({
        message: 'The user has been deleted'
      });
    }
    else
    {
      return res.json({
        message : 'the user to delete was not found'
      })
    }

  } catch (err) {
    return res.status(500).json({
      message: `err in deleting user ${err.message}`
    });
  }

}

module.exports.addLobby = async function(req,res)
{
  try
  {
    
    let userId = req?.body?.id;

    if(userId === null || userId === undefined)userId = req.id;
    
    let lobbyId = req.body.lobbyId

    const updatedUser = await userModel.findByIdAndUpdate(
      userId,
      { $push: { lobbies: lobbyId } },
      { new: true, runValidators: false }
    );

    if(updatedUser)
    {
      return res.json({
        message : "lobby attached to user's account",
        data : updatedUser
      })
    }
    else
    {
      return res.json({
        message : "some error occurred while adding lobby to user's account"
      })
    }

  }catch(err)
  {
    return res.json({
      message : `some error occurred while adding lobby to user's account , ${err.message}`
    })
  }
}

module.exports.getUserByEmail = async function(req,res){
  try{
    let mongores = await userModel.findOne({email:req.params.email})
    if(mongores)
    {
      return res.json({
        success: true,
        data : mongores
      })
    }
    else
    {
      return res.json({
        success : false,
        message : "the user with such an email was not found"
      })
    }
  }
  catch(error)
  {
    return res.json({
      success : false,
      message : "error in fetching user by email"
    })
  }
}


module.exports.deleteLobbyFromUser = async function(req, res) {
  try {
    let id = req.body.id;
    let lobbyToRemove = req.body.lobby_id;
    let user = await userModel.findById(id);
    let newLobbies = user.lobbies.filter((lobby)=>{return (lobby._id!=lobbyToRemove)})
    let updatedUserData = await userModel.findByIdAndUpdate(id,{lobbies:newLobbies},  { runValidators: false , new: true })
    // runvalidators was false because confirmPassword field
    // which is one of the required fields is missing in our db docs
    // also new is true because we want the updated data
    if(updatedUserData)
    {
      return res.json({
        message : "the user was updated",
        updatedData : updatedUserData
      })
    }
    else
    {
      return res.json({
        message : "the user couldnt be updated"
      })
    }
  } catch (err) {
    return res.status(500).json({
      message: `err in updating user ${err.message}`
    });
  }

}


module.exports.getMyLobbies = async function(req, res) {
  let id = req.id;
  
  try {
    let thatOneUser = await userModel.findById(id).populate({
      path: 'lobbies',
      populate: [
        { path: 'user1', select: '_id fullname' },
        { path: 'user2', select: '_id fullname' }
      ]
    });
    if (thatOneUser) {
      
      return res.json({
        success: true,
        message: "user has been fetched",
        data: thatOneUser.lobbies
      });
    } else {
      return res.json({
        success: false,
        message: "the user doesnt exist"
      });
    }
  } catch (err) {
    console.log(err.message)
    return res.status(500).json({
      success: false,
      message: `err in fetching user by id ${err.message}`
      
    });
  }
}