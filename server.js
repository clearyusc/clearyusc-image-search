 /******************************************************
 * PLEASE DO NOT EDIT THIS FILE
 * the verification process may break
 * ***************************************************/

'use strict';

var express = require('express');
var app = express();
var mongodb = require(process.cwd()+'/datastore.js')

const SEARCH_API_KEY = "AIzaSyBEEBx9ItiTIQKE-4uNNYBlnIqhYSUVmBc" 
const SEARCH_ENGINE_ID = "001153346103810259976:qlqqw-ih6t4"

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

// Routing for User Search Scenario
app.route('/api/imagesearch/*')
  .get((req,res) => {
  let queryString = req.params[0]
  let offset = req.params[1]
  console.log("querystring = "+queryString)
  console.log("offset = "+offset)
  console.log('originalURL'+req.originalUrl)
  let searchEngineGETRequest = "https://www.googleapis.com/customsearch/v1?"+
      "key="+SEARCH_API_KEY+
      "&cx="+SEARCH_ENGINE_ID+"&q="+queryString;

  //TODO: Filter for the specific data we need for this project
  
  //TODO: 
  
  //res.route(searchEngineGETRequest)
res.redirect(searchEngineGETRequest)
  //res.type('txt').send(res.redirect(searchEngineGETRequest));
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

