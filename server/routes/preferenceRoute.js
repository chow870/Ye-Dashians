const express = require('express')
const PreferenceFormSubmitRouter = express.Router();
const { preferenceSubmit, deletePreference } = require('../controllers/preferenceSubmissionController');
PreferenceFormSubmitRouter
  .route('/')
  .post(preferenceSubmit)
  // in the delete method for the rest ful apis we cant profvide a bnocy thats wehy wer eill be using request querires 
  .delete(deletePreference)
module.exports = PreferenceFormSubmitRouter