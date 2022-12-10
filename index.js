const express = require('express');
const bodyParser = require('body-parser');
// const dbConnect = require('./database/dbconnect');
const {fetchVideoJob} = require('./controllers/cron.controller')
require('dotenv').config();
const {app} = require('./controllers/app.controller')


// connecting to DB
// dbConnect();

// using npm middlewares
app.use(express.json());
app.use(express.urlencoded( {extended: true} ));
app.use(bodyParser.json());

// handle cron job
try {
    console.log("Starting video fetching job from youtube api...");
    fetchVideoJob();  // start fetching videos at every 10 minutes
} catch (error) {
    console.log("Error while running cron job ", error);
    throw error
}

// handling the ports
const port = process.env.PORT || 8000;
app.listen(port, () => {
    console.log(`Server up and running on port ${port}`);
});