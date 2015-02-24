var __base = '../',
	c = require(__base + 'shared-config/constants'),
	log = c.getLog('sys-admin/import-sample-data'),

	MongoClient = require('mongodb').MongoClient,
	sampleData = require('./sample-data/fejson.js'),

	DATABASE = c.db.fatalities,
	COLLECTION = c.collection.fatalities,
	URL = c.url.mongo + DATABASE;

MongoClient.connect(URL, function(err, db) {

	if(err){
		
		log('error', 'mongodb could not connect to database', err);
	}

	var collection = db.collection(COLLECTION),
		messageLocation = COLLECTION + ' collection within the ' + DATABASE + ' database, running on ' + URL;

	collection.drop(function(err, body){

		if (err) {

			log('error', 'mongodb could not drop the ' + messageLocation, err);
		}

		if (body) {

			log('trace', 'mongodb dropped the ' + messageLocation);
		}
	});

	collection.find({}).toArray(function(err, body){
		
		if(!body.length){

			collection.insert(sampleData.rows, function(err, body){

				log('trace', 'mongodb imported ' + body.length + ' documents into the ' + messageLocation);

				db.close();
			});

			return;
		}

		db.close();
	});
});