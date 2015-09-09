var __base = '../',
	c = require(__base + 'shared-config/constants'),
	log = c.getLog('sys-admin/import-sample-data'),

	MongoClient = require('mongodb').MongoClient,
	sampleData = require('./sample-data/fejson.js'),

	DATABASE = "mongodb://heroku:c-rJompa5mbNDiERpkBJMfKXbfSazY_YaBGqrnFzmwgao-WRaPHaU_ZED_TU7zp2C8lp3OV1azqFINmN6EQ27A@candidate.37.mongolayer.com:10928,candidate.13.mongolayer.com:11150/app40069500",
	COLLECTION = "users",
	URL = DATABASE;

MongoClient.connect(URL, function(err, db) {

	if(err){
		
		log('error', 'mongodb could not connect to database', err);
	}

	var collection = db.collection(COLLECTION),
		messageLocation = COLLECTION + ' collection within the ' + DATABASE + ' database, running on ' + URL;

	collection.find({"username" : "troythewolfe"}).toArray(function(err, body){
		
		if(err){
			console.log(err);
		}
		
		console.log(body);

		db.close();
	});
});