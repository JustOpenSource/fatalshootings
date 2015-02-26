var __base = '../',
    c = require(__base + 'shared-config/constants'),
    log = c.getLog('sys-admin/clean-data'),

    MongoClient = require('mongodb').MongoClient,
    sampleData = require('./sample-data/fejson.js'),

    DATABASE = c.db.fatalities,
    COLLECTION = c.collection.fatalities,
    URL = c.url.mongo + DATABASE;

MongoClient.connect(URL, function(err, db) {

    if(err){

        log('error', 'mongodb could not connect to database', err);
    }

    var collection = db.collection(COLLECTION);

    //TODO:
    /*
    * convert age to int
    * convert date to yyyymmdd - date { gte : /^YYYYMM/, ...
    * get rid of space before race string, maybe encode it in schema?
    *
    *
    *
    * */

});