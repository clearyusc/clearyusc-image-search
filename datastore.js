'use strict'

var timestamp = require('time-stamp');
//lets require/import the mongodb native drivers.
var mongodb = require('mongodb');

//We need to work with "MongoClient" interface in order to connect to a mongodb server.
var MongoClient = mongodb.MongoClient;

// Connection URL. This is where your mongodb server is running.

// TODO: Make it more secure by implementing it the process variable way
// var MONGODB_URI = 'mongodb://'+process.env.USER+':'+process.env.PASS+'@'+process.env.HOST+':'+process.env.DB_PORT+'/'+process.env.DB;
//var url = process.env.MONGODB_URI;
var url = 'mongodb://dbuser1:password1@ds035846.mlab.com:35846/image-search-db';
//(Focus on This Variable)

var db
// Use connect method to connect to the Server
var dbConnect = MongoClient.connect(url, function (err, database) {
  if (err) {
    console.log('Unable to connect to the mongoDB server. Error:', err);
  } else {
    console.log('Connection established to', url);

    db = database
    // do some work here with the database.
    //db.insert
    //Close connection
    //database.close();
  }
});

var logQuery = (term) => {
  // TODO: dont save req.body. save the name of the search and the timestamp.
  let queryObj = {"term":term, "when": timestamp('MM/DD/YYYY:mm:ss')}
  db.collection('search_queries').save(queryObj, (err, result) => {
    if (err) return console.log(err)

    console.log('saved queryObj to database')
  });
}

var viewQueryHistory = (res) => {
  db.collection('search_queries').find().toArray(function(err, results) {
    if (err) return console.log(err)
    
  res.type('txt').send(JSON.stringify(results, null, 2))
  // send HTML file populated with quotes here
})
}

module.exports = {dbConnect, logQuery, viewQueryHistory}