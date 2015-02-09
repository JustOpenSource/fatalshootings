var __base = '../',
	c = require(__base + 'shared-config/constants'),
	MongoClient = require('mongodb').MongoClient;

/*
connect('fe', function(e,d,c){
	c()
});
*/

module.exports = function(collection, cb){

	cb = cb || function(e,d,c){c()};

	var url = 'mongodb://localhost:27017/' + collection;

	// Use connect method to connect to the Server
	MongoClient.connect(url, function(err, db) {

		if(!err){

			c.l("Connected correctly to server");
		
			cb(err, db, function(){
				db.close();
			});

		} else {

			c.l("Error connecting to server");

			cb(err);

		}
		
	});
}