const express = require('express');
const bodyParser = require('body-parser');
const dbConnect = require('./database/dbconnect');
const videoService = require('../services/video.service')
require('dotenv').config();
const app = express();

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

app.use('/ping', (req, res) => {
  res.send('Working Service');
});

app.get('/searchVideo', async (req, res) => {
  try {
      let video_title = req.query.video_title;
      const result = await videoService.searchVideo(video_title);
      return res.status(200).send({success: true, data: result});
  }
  catch (err) {
      console.log(err);
      res.status(500).send({success: false, msg: 'Failure', data : err});
  }
});

module.exports = {app};