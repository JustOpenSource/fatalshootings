var __base = '../',
	c = require(__base + 'shared-config/constants'),
	log = c.getLog(c.log, 'shared-utils/mongo-db'),

	MongoClient = require('mongodb').MongoClient;

/*
connect('fe', function(e,d,c){
	c()
});
*/

module.exports = function(database, cb){

	//defines default callback to call parent callback 
	cb = cb || function(e,d,c){c()};

	var url = c.url.mongo + database;

	log('trace', 'attempting to connect to ' + url);

	// Use connect method to connect to the Server
	MongoClient.connect(url, function(err, db) {

		if(!err){

			log('trace', 'connected to ' + url);
		
			cb(err, db, function(){
				db.close();
			});

		} else {

			log('error', 'could not connect to connected to ' + url, err);

			cb(err);

		}
		
	});
}