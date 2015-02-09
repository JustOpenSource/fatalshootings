var __base = '../../',
  c = require(__base + '../shared-config/constants'),
  _ = require('underscore'),
  mongodb = require(__base + '../shared-utils/mongo-db'),
  data = require(__base + 'db/sample_data/pfcdata.js');

var verifyImport = function(db,  cb) {

  // Get the documents collection
  var collection = db.collection('fe');

  collection.find({
  
  }).toArray(cb);
}

mongodb('fe', function(err, db, closeDB){
  if(!err){
    verifyImport(db, function(err, data){
      c.l('added entries', data.length);
      closeDB();
    });
  }
});