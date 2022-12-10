const axios = require('axios');
const {smartSearchVideo, insertMany, getLastVideoTime } = require('../database/video.model');
require('dotenv').config();
const querystring = require('querystring');

const searchVideo = async (videoTitle) => {
  let result = await smartSearchVideo(videoTitle);
  console.log("Result for video title: ", 
              videoTitle," is : ", 
              JSON.stringify(result, null, 4));
  return result;
};

const fetchYtVideos = async (publishedAfter, publishedBefore) => {
  const parameters = {
    part: process.env.YT_PART,
    key: process.env.YT_KEY,
    q: process.env.YT_SEARCH_QUERY,
    type: process.env.YT_TYPE,
    order: process.env.YT_ORDER,
    publishedAfter : publishedAfter,
    publishedBefore : publishedBefore,
    maxResults: process.env.YT_MAX_RESULT
  }

  const get_request_args = querystring.stringify(parameters);
  let URL = process.env.YT_ENDPOINT + "?" + get_request_args;

  const ytData = await axios.get(URL)
  return ytData['data'];
    // .then(function (response) {
    //   _saveMinedVideoDetails(response, config.youtube.SEARCH_QUERY);
    // })
    // .catch(function (error) {
    //   console.log("Error saving the response", error);
    // });
} 




// method for cron job to fetch new videos at every 10 minutes
const startVideoFetching = async () => {
  let lastVideoTime = await _getLastFetchedRecordTime();
  _getMinedVideoData(lastVideoTime);
};

const _getLastFetchedRecordTime = async () => {
  let lastVideoTime = null;
  let lastVideoTimeObj = await getLastVideoTime();
  // console.log(lastVideoTimeObj.data);
  if(lastVideoTimeObj && lastVideoTimeObj.data) {
      lastVideoTime = lastVideoTimeObj.data.publishTime;
  }
  return (lastVideoTime || process.env.YT_PUBLISHED_AFTER);
};

const _getMinedVideoData = (lastVideoTime) => {
  // GET parameters
  const parameters = {
      part: process.env.YT_PART,
      key: process.env.YT_KEY,
      q: process.env.YT_SEARCH_QUERY,
      type: process.env.YT_TYPE,
      order: process.env.YT_ORDER,
      publishedAfter: lastVideoTime,
      maxResults: process.env.YT_MAX_RESULT
  }
  const get_request_args = querystring.stringify(parameters);

  let URL = process.env.YT_ENDPOINT + "?" + get_request_args;

  axios.get(URL)
      .then(function (response) {
        _saveMinedVideoDetails(response, process.env.YT_SEARCH_QUERY);
      })
      .catch(function (error) {
        console.log("Error saving the response", error);
      });
}

const _saveMinedVideoDetails = (response, video_title) => {
  const docsArray = [];
  response.data.items.forEach(function (element) {
      const obj = {};
      obj.video_title = video_title;
      obj.data = element.snippet;
      delete obj.data.channelTitle;
      delete obj.data.liveBroadcastContent;
      docsArray.push(obj);
  });
  console.log("Saving Video Data: ", JSON.stringify(docsArray, null, 4));
  insertMany(docsArray);
}

module.exports = {
  fetchYtVideos,
  searchVideo,
  startVideoFetching
};