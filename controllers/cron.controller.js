require('dotenv').config();
const cron = require('node-cron');
const { startVideoFetching } = require('../services/video.service');


const fetchVideoJob = () => {
  cron.schedule(process.env.FETCH_INTERVAL, () => {
    startVideoFetching();
  });
}

module.exports = {fetchVideoJob};