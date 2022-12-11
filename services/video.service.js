const axios = require('axios');
const {searchByTitle, insertMany, getLastVideoTime, getAllVideos } = require('../database/video.model');
require('dotenv').config();
const querystring = require('querystring');
const { getKey, updatedKey } = require('../database/key.model');

const searchVideos = async (title, limit, page) => {
  let result = await searchByTitle(title, limit, page);
  console.log("Result for video title: ", title," is : ", JSON.stringify(result, null, 4));
  return result;
};

const searchAllVideos = async (searchQuery, limit, page) => {
  let result = await getAllVideos(searchQuery, limit, page);
  console.log("Result for all video query: ", searchQuery," is : ", JSON.stringify(result, null, 4));
  return result;
};



// method for cron job to fetch new videos at every 10 minutes
const startVideoFetching = async () => {
  let lastVideoTime = await _getLastFetchedRecordTime();
  let key = await getKey();
  console.log("Curr_Key: ", key.apiKey);
  try {
    _getMinedVideoData(lastVideoTime, key.apiKey);
  } catch (err) {
    console.log(err);
    if (err.errors && err.errors.length > 0 && err.errors[0]['reason'] == 'quotaExceeded'){
      let newKey = await updatedKey(key);
      if ( newKey === null ){
        console.log("All keys are exhausted. Add new keys to the DB");
      }
    }
  }

  
};

const _getLastFetchedRecordTime = async () => {
  let lastVideoTimeObj = await getLastVideoTime();
  if(lastVideoTimeObj) {
      console.log("last fetched from db : ", lastVideoTimeObj.publishedAt);
      let timeObject = new Date(lastVideoTimeObj.publishedAt)     
      let newTime = new Date(timeObject.getTime() + (0.5)*60000); // creating a 30sec time window
      return (newTime.toISOString());
  }
  console.log("last fetched from env : ", process.env.YT_PUBLISHED_AFTER);
  return (process.env.YT_PUBLISHED_AFTER);
};

const _getMinedVideoData = (lastVideoTime, key) => {
  // GET parameters
  const parameters = {
      part: process.env.YT_PART,
      // key: process.env.YT_KEY,
      key: key,
      q: process.env.YT_SEARCH_QUERY,
      type: process.env.YT_TYPE,
      order: process.env.YT_ORDER,
      publishedAfter: lastVideoTime,
      maxResults: process.env.YT_MAX_RESULT
  }
  const get_request_args = querystring.stringify(parameters);

  let URL = process.env.YT_ENDPOINT + "?" + get_request_args;
  console.log("Req url : ", URL);

  axios.get(URL)
    .then(function (response) {
      _saveMinedVideoDetails(response, process.env.YT_SEARCH_QUERY);
    })
    .catch(function (error) {
      console.log("Error saving the response", error);
    });
}

const _saveMinedVideoDetails = (response, searchQuery) => {
  const docsArray = [];
  response.data.items.forEach(
    function (element) {
        const obj = {};
        obj.query = searchQuery; 
        obj.video_title = element.snippet.title;
        obj.description = element.snippet.description;
        obj.publishedAt = element.snippet.publishedAt;
        obj.thumbnail   = element.snippet.thumbnails.default.url;
        docsArray.push(obj);
      }
    );
  console.log("Saving Video Data: ", JSON.stringify(docsArray, null, 4));
  insertMany(docsArray);
}

module.exports = {
  searchVideos,
  searchAllVideos,
  startVideoFetching
};