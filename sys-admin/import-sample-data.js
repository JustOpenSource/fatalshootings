var __base = '../',
	c = require(__base + 'shared-config/constants'),
	MongoClient = require('mongodb').MongoClient,
	sampleData = require('./sample-data/fejson.js'),

	DATABASE = c.db.fatalities,
	COLLECTION = c.collection.fatalities,
	URL = c.url.mongo + DATABASE;

MongoClient.connect(URL, function(err, db) {

	if(err){
		c.l('mongodb :ERROR: problem connection to database');
	}

	var collection = db.collection(COLLECTION),
		messageLocation = COLLECTION + ' collection within the ' + DATABASE + ' database, running on ' + URL;

	collection.drop(function(err, body){
		if(err){
			c.l('ERROR: mongodb could not drop the ' + messageLocation);
		}

		if(body){
			c.l('SUCCESS: mongodb dropped the ' + messageLocation);
		}
		
	});

	collection.find({}).toArray(function(err, body){
		
		if(!body.length){

			collection.insert(sampleData.rows, function(err, body){

				c.l('SUCCESS: mongodb imported ' + body[0].total_rows + ' documents to the ' + messageLocation);

				db.close();
				
			});

			return;
		}

		db.close();

	});

});