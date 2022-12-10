// defining database models and methods
const mongoose = require("mongoose");
const conn = require('./dbConnect').dbConnect;

const videoSchema = new mongoose.Schema({
    video_title: {
      type: String,
      required: true
    },
    video_details: mongoose.Schema.Types.Mixed,
    createdAt: { 
      type: Date, 
      required: true, 
      default: Date.now 
    }
  },{strict: false}
);

let Videos = conn.model("videos", videoSchema);

const insert = (doc) => {
  return Videos.create(doc);
}

const insertMany = (docsArray) => {
  return Videos.insertMany(docsArray);
}

const getLastVideoTime = () => {
  return Videos.findOne().sort({'data.publishTime': -1}).limit(1).select({'data.publishTime': 1}).lean();
};

function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

const smartSearchVideo = (video_title) => {
  const regex = new RegExp(escapeRegex(video_title), 'gi');
  return Videos.find({'data.title': regex}).lean();
};

module.exports = {
  insert,
  smartSearchVideo,
  insertMany,
  getLastVideoTime
};