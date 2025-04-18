const express = require('express')
const userRouter = express.Router();
const {protectRoute} = require('./AuthHelper')
const { getUsers, getOneUser, addUser, updateUser, deleteUser, addLobby , getUserByEmail , deleteLobbyFromUser} = require('../controllers/UserController');
const {isAuthorised} = require('../controllers/AuthController')



userRouter
  .route('/removeLobby')
  .patch(deleteLobbyFromUser)

userRouter.use(protectRoute);

userRouter
  .route('/getAll')
  .get(getUsers)

userRouter
  .route('/addNewLobbyToUser')
  .patch(addLobby)

userRouter
  .route('/userProfile/:id')
  .get(getOneUser) 

userRouter
  .route('/userProfileByEmail/:email')
  .get(getUserByEmail)  

userRouter
  .route('/:id')
  .patch(updateUser)
  .delete(deleteUser)

  
// userRouter.use(isAuthorised(['admin']));
// userRouter
//   .route('/getAll')
//   .get(getUsers)





  module.exports = userRouter