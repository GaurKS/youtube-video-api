# Objective
To make an API to fetch latest videos sorted in reverse chronological order of their
publishing date-time from YouTube for a given tag/search query in a paginated response.

# Basic Requirements:

- Server should call the YouTube API continuously in background (async) with some interval (say 10 seconds) for fetching the latest videos for a predefined search query and should store the data of videos (specifically these fields - Video title, description, publishing datetime, thumbnails URLs and any other fields you require) in a database with proper indexes.
- A GET API which returns the stored video data in a paginated response sorted in
  descending order of published datetime.
- A basic search API to search the stored videos using their title and description.

# References

- [YouTube data v3 API](https://developers.google.com/youtube/v3/getting-started)

- [Search API reference](https://developers.google.com/youtube/v3/docs/search/list)
  > To fetch the latest videos you need to specify these: type=video, order=date,
publishedAfter=<DATE_TIME>
  > Without publishedAfter, it will give you cached results which will be too old
 - [Google Cloud Console](https://console.cloud.google.com/apis/api/youtube.googleapis.com)

# About Project

## Tech Stack
- NodeJS
- MongoDB
- ExpressJS
- Youtube Data API v3

## Pre-requisites
- Install [Node.js](https://nodejs.org/en/)

## Getting Started 
- Clone the repository
```
git clone  <project_url>
```
- Install dependencies
```
cd <project_name>
npm install
```
- Update `.env` file with Mongodb url
```
DATABASE = 'mongodb+srv://<USER_NAME>:<PASSWORD>@cluster0.mzyu59k.mongodb.net/?retryWrites=true&w=majority'
``` 
- Build and run the project
```
npm run start
```
- Navigate to `http://localhost:8000`

## API Document endpoints

  GET Endpoint : `http://localhost:8000/getAllVideos?q=sea&limit=5&page=1`

  GET Endpoint : `http://localhost:8000/getByTitle?title=Thieves`

POST Endpoint: ` http://localhost:8000/addKey/:key`

Details related to application endpoints and sample response can be found in the below Postman Collection.
 > [Collection link](https://api.postman.com/collections/17353116-c2b91cea-d243-4618-826e-bc201d1c9ce6?access_key=PMAT-01GM1HGQHRVPWF15XC9AXERXHH)
