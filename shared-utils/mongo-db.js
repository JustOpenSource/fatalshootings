var __base = '../',
	c = require(__base + 'shared-config/constants'),
	
	MongoClient = require('mongodb').MongoClient,
	
	DB_URL = 'mongodb://localhost:27017/';

/*
connect('fe', function(e,d,c){
	c()
});
*/

module.exports = function(database, cb){

	//todo: look into using promises to manage callbacks

	//defines default callback to call parent callback 
	cb = cb || function(e,d,c){c()};

	var url = DB_URL + database;

	// Use connect method to connect to the Server
	MongoClient.connect(url, function(err, db) {

		if(!err){

			c.l("SUCCESS: correctly to server");
		
			cb(err, db, function(){
				db.close();
			});

		} else {

			c.l("ERROR: did not connect to server", err);

			cb(err);

		}
		
	});
}