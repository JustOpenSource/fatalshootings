var MongoClient = require('mongodb').MongoClient, 
	assert = require('assert');

// Connection URL
var url = 'mongodb://localhost:27017/pcf';

// Use connect method to connect to the Server
MongoClient.connect(url, function(err, db) {
  assert.equal(null, err);
  
  console.log("Connected correctly to server");

  db.close();
});