const express = require('express');
const bodyParser = require('body-parser');
const dbConnect = require('./database/dbconnect');
require('dotenv').config();
const app = express();


// connecting to DB
dbConnect();

// using npm middlewares
app.use(express.json());
app.use(express.urlencoded( {extended: true} ));
app.use(bodyParser.json());

// handling the ports
const port = process.env.PORT || 8000;
app.listen(port, () => {
    console.log(`API running on port ${port}`);
});