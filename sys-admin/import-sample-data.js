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
		
        console.log(sampleData.rows.length);
        
		if(!body.length){

            var batches = Math.ceil(sampleData.rows.length / 1000);
            for (var i = 0; i < batches; i++) {
        
                collection.insert(sampleData.rows.slice(i*1000, (i*1000)+1000), function(err, body){
                    if (err) return console.log(err);
                    log('trace', 'mongodb imported ' + ((body && body.length) || 0) + ' documents into the ' + messageLocation);

                });
            }

			return;
		}

		db.close();
	});
});