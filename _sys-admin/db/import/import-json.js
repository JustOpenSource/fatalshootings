var __base = __base || '../../',
	c = require(__base + 'config/constants'),
	_ = require('underscore'),
	mongo = require(__base + '../shared-utils/mongo-db'),
	data = require(__base + 'db/sample_data/pfcdata.js');

var insertJSON = function(db, cb) {

  // Get the documents collection
  var collection = db.collection('fe');

  //collection.remove({}, cb);

  //Insert some documents
  collection.insert(data.rows, cb);
}

mongo('fe', function(err, db, cb){
	insertJSON(db, function(errr, body){
		c.l("imported " + body.length + "entries");
		cb();
	});
});