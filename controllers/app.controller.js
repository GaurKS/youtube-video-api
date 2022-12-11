const express = require('express');
const bodyParser = require('body-parser');
// const dbConnect = require('./database/dbconnect');
const videoService = require('../services/video.service')
require('dotenv').config();
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));


app.get('/ping', (req, res) => {
  res.send('Job is running...');
});


/**
 * request URL: http://localhost:8000/getAllVideos?q=sea&limit=5&page=1
 * endpoint to fetch all the stored videos in paginated response
 */
app.get('/getAllVideos', async (req, res) => {
  try {
    let limit = req.query.limit ? parseInt(req.query.limit) : 20
    let page = req.query.page ? parseInt(req.query.page) : 1
    let searchQuery = req.query.q;
    const result = await videoService.searchAllVideos(searchQuery, limit, page);
    return res.status(200).send({success: true, data: result});
  }
  catch (err) {
      console.log(err);
      res.status(500).send({success: false, msg: 'Failure', data : err});
  }
})


/**
 * request URL: http://localhost:8000/getByTitle?title=sea
 * endpoint to fetch all the stored videos in paginated response
 */
app.get('/getByTitle', async (req, res) => {
  try {
    let limit = req.query.limit ? parseInt(req.query.limit) : 10
    let page = req.query.page ? parseInt(req.query.page) : 1
    let title = req.query.title;
    const result = await videoService.searchVideos(title, limit, page);
    return res.status(200).send({success: true, data: result});
  }
  catch (err) {
      console.log(err);
      res.status(500).send({success: false, msg: 'Failure', data : err});
  }
});

module.exports = { app };