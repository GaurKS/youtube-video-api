// defining database models and methods for API keys
const mongoose = require("mongoose");
const conn = require('./dbConnect').dbConnect;

const keySchema = new mongoose.Schema({
    apiKey: {
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

let Keys = conn.model("keys", keySchema);

const getKey = () => {
  return Keys.findOne().sort({'createdAt': 'asc'}).limit(1).select({'apiKey': 1});
}

const insert = (doc) => {
  return Keys.create(doc);
}

const insertMany = (docsArray) => {
  return Keys.insertMany(docsArray);
}

const updatedKey = (usedKey) => {
  // Keys.findOne({'apiKey': usedKey})
  Keys.deleteOne({'apiKey': usedKey});
  let newKey = getKey();
  return newKey;
}

module.exports = {
  getKey,
  updatedKey,
  insert,
  insertMany
};