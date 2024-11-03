const express = require('express')
const lobbyRouter = express.Router();
const {addLobby , joinLobby , getAllLobies , updateLobby} = require('../controllers/lobbyController')
lobbyRouter
  .route('/createNew')
  .post(addLobby)
lobbyRouter
  .route('/join')
  .patch(joinLobby)
lobbyRouter
  .route('/updateLobby')
  .patch(updateLobby)  
lobbyRouter
  .route('/getAll')
  .get(getAllLobies)
module.exports = lobbyRouter

