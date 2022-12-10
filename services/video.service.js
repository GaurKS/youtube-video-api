const axios = require('axios');
const {smartsearch, insertMany, getLastVideoTime } = require('../database/video.model');
require('dotenv').config();

module.exports = {
  searchVideo,
  startVideoMining
};