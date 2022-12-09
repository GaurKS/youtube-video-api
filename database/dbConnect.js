const mongoose = require("mongoose");
require('dotenv').config();

const dbConnect = () => {
  mongoose
  .set('strictQuery', false)
  .connect(process.env.DATABASE, {
      useNewUrlParser: true, 
      useUnifiedTopology: true,
  })
  .then(() => console.log("DataBase Connected Successfully..."))
  .catch((err) => console.log("Error while connecting: " + err));
};

module.exports = dbConnect;