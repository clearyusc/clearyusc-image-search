/******************************************************
 * PLEASE DO NOT EDIT THIS FILE
 * the verification process may break
 * ***************************************************/

'use strict';

var express = require('express');
var app = express();
var mongodb = require(process.cwd()+'/datastore.js')
var Client = require('node-rest-client').Client;
 var client = new Client();
var searchResults = [];
var searchResultsCounter = 0;

const SEARCH_API_KEY = "AIzaSyBEEBx9ItiTIQKE-4uNNYBlnIqhYSUVmBc" 
const SEARCH_ENGINE_ID = "001153346103810259976:qlqqw-ih6t4"
const GOOGLE_MAX_SEARCH_RESULTS = 10

if (!process.env.DISABLE_XORIGIN) {
  app.use(function(req, res, next) {
    var allowedOrigins = ['https://narrow-plane.gomix.me', 'https://www.freecodecamp.com'];
    var origin = req.headers.origin || '*';
    if(!process.env.XORIG_RESTRICT || allowedOrigins.indexOf(origin) > -1){
         console.log(origin);
         res.setHeader('Access-Control-Allow-Origin', origin);
         res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    }
    next();
  });
}

app.use('/public', express.static(process.cwd() + '/public'));

  
app.route('/')
    .get(function(req, res) {
		  res.sendFile(process.cwd() + '/views/index.html');
    })

app.route('/testdb')
  .get(function(req,res) {
    mongodb.dbConnect
  // TODO: implement a try catch with error handling here
    res.type('txt').send('hi - db?');
})

/* DEV PLAN

1. Routing for both user scenarios & urls
-- need to handle search term AND offset number
2. Implement Custom Search JSON/Atom API
3. Connect to MongoDB
4. Store search queries & timestamp to mongodb

*/

function executeSearch(res, requestURL, start, max) {
  console.log("executeSearch(), start = "+start)
  console.log("executeSearch(), max = "+max)
  
  client.get(requestURL.concat("&start="+start), function (data, response) {
      console.log("executeSearch(), modified URL = "+requestURL.concat("&start="+start));

      //TODO: Filter for the specific data we need for this project
      // url, snippet, thumbnail, context
    
    //TODO: error handling on the GET request response!
    
    // TODO: handle the use case scenario where the offset < the number of search results returned by the query
    //console.log(JSON.stringify(data,3))
    const rawSearchResults = data
    
    // TODO: Rewrite this to use array filtering (see below!)
    //data.forEach((result) => {})
    let numResultsToLoad = 0;
    if (max - searchResults.length >= GOOGLE_MAX_SEARCH_RESULTS) {
      // we need to load another page or more of results
      numResultsToLoad = GOOGLE_MAX_SEARCH_RESULTS
    } else {
      numResultsToLoad = max - searchResults.length
    } 
   
    for (let i = 0; i < numResultsToLoad; i++) {
      let item = rawSearchResults.items[i]
      let obj = {"url":null,"snippet":null,"thumbnail":null,"context":null}
      obj["url"] = item["link"]
      obj["snippet"] = item["snippet"]
      obj["thumbnail"] = item["image"]["thumbnailLink"]
      searchResults.push(obj)
      //searchResults.push(item)
    }
  
    if (searchResults.length < Number(max)) {
      // more search results need to be loaded, must be done asynchronosouly
      let nextStartIndex = Number(start) + GOOGLE_MAX_SEARCH_RESULTS
      executeSearch(res, requestURL, nextStartIndex, Number(max))
    } else {
      // no more search results need to be loaded
      res.type('txt').send(JSON.stringify(searchResults, null, 2))
    }
    
    
    
  });
}


// Routing for User Search Scenario
app.route('/api/imagesearch/*')
  .get((req,res) => {
  
  searchResults = [] // clear the search results from a previous search
  searchResultsCounter = 0;
  
  let queryString = req.params[0]
  let offset = Number(req.query.offset) // decimal radix
  console.log("querystring = "+queryString)
  console.log("offset = "+offset)
  console.log('originalURL'+req.originalUrl)
  let searchEngineGETRequest = "https://www.googleapis.com/customsearch/v1?"+
      "key="+SEARCH_API_KEY+
      "&cx="+SEARCH_ENGINE_ID+"&q="+queryString+"&searchType=image";

  executeSearch(res, searchEngineGETRequest, 1, Number(offset));
  
});

// Routing for Latest Search keys
app.route('/api/latest')
  .get((req,res) => {
  //res.type('txt').send('latest');
});

// Respond not found to all the wrong routes
app.use(function(req, res, next){
  res.status(404);
  res.type('txt').send('Not found');
});

// Error Middleware
app.use(function(err, req, res, next) {
  if(err) {
    res.status(err.status || 500)
      .type('txt')
      .send(err.message || 'SERVER ERROR');
  }  
})

app.listen(process.env.PORT, function () {
  console.log('Node.js listening ...');
});

