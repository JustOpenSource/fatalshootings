var __base = '../',
	c = require(__base + 'shared-config/constants'),
	MongoClient = require('mongodb').MongoClient;

/*
connect('fe', function(e,d,c){
	c()
});
*/

module.exports = function(database, cb){

	//todo: look into using promises to manage callbacks

	//defines default callback to call parent callback 
	cb = cb || function(e,d,c){c()};

	var url = c.url.mongo + database;

	c.l('Attempting to connect to ' + url);

	// Use connect method to connect to the Server
	MongoClient.connect(url, function(err, db) {

		if(!err){

			c.l('SUCCESS: connected to ' + url);
		
			cb(err, db, function(){
				db.close();
			});

		} else {

			c.l('ERROR: did not connect to server', err);

			cb(err);

		}
		
	});
}