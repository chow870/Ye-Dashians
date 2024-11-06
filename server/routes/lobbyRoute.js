const express = require('express')
const lobbyRouter = express.Router();
const {addLobby , joinLobby , getAllLobies , updateLobby , deleteLobby} = require('../controllers/lobbyController')
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
  // we will be using query params as a delete request for restful apis must not have body
lobbyRouter
  .route('/delete')
  .delete(deleteLobby)
module.exports = lobbyRouter

