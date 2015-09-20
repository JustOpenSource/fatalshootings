var __base = __base || '../';
var c = require(__base + 'constants');
var log = require(__base + 'utils/log')('utils/mongo-db');

var MongoClient = require('mongodb').MongoClient;

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