// defining database models and methods
const mongoose = require("mongoose");
const conn = require('./dbConnect').dbConnect;

const videoSchema = new mongoose.Schema({
    query: {
      type: String,
      required: true
    },
    video_title: {
      type: String,
      required: true
    },
    description: {
      type: String
    },
    publishedAt: {
      type: String,
      required: true
    },
    thumbnail: {
      type: String,
      required: true
    },
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
  return Videos.findOne().sort({'publishedAt': 'desc'}).limit(1).select({'publishedAt': 1});
};

const getAllVideos = (searchQuery, limit, page) => {
  return Videos.find({'query': searchQuery}).sort({'publishedAt': 'desc'}).limit(limit).skip(limit*page).lean();
};

const searchByTitle = (title, limit, page) => {
  return Videos.find({ $text: { $search: title } }).sort({'publishedAt': 'desc'}).limit(limit).skip(limit*page).lean();
}

module.exports = {
  insert,
  searchByTitle,
  insertMany,
  getLastVideoTime,
  getAllVideos
};