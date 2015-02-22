var __base = '../',
	c = require(__base + 'shared-config/constants'),
	MongoClient = require('mongodb').MongoClient;
	sampleData = require('./sample-data/fejson.js'),
	url = 'mongodb://localhost:' + c.ports.mongodb + '/' + c.db_name;

MongoClient.connect(url, function(err, db) {

	if(err){
		c.l('mongodb :ERROR: problem connection to database');
	}

	var collection = db.collection(c.collections.fatalities);

	collection.drop();

	collection.find({}).toArray(function(err, body){
		
		if(!body.length){

			collection.insert(sampleData, function(err, body){

				c.l('mongodb :SUCCESS: imported ' + body[0].total_rows + ' rows successfully');

				db.close();
				
			});

			return;
		}

		db.close();

	});

});