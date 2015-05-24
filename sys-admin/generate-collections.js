var __base = '../';
var c      = require(__base + 'shared-config/constants');
var log    = c.getLog('sys-admin/import-sample-data');

var MongoClient = require('mongodb').MongoClient;
var sampleData  = require('./sample-data/fejson.js');


var DATABASE    = c.db.fatalities;
var COLLECTIONS = Object.keys(c.collection).map(function(n) { return c.collection[n] });
var URL         = c.url.mongo + DATABASE;

MongoClient.connect(URL, function(err, db) {

    if(err){

        log('error', 'mongodb could not connect to database', err);
    }

    COLLECTIONS.forEach(function(collection) {
        db.createCollection(collection);
        db.close();
    });
});