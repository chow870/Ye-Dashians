const express = require('express');
const { FetchPictures } = require('../../controllers/MapsController/FetchPictures');
const PictureSearchRouter = express.Router();

PictureSearchRouter
  .route('/')
  .get(FetchPictures)

module.exports = PictureSearchRouter