var c = require('./shared-config/constants');
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;
var log = console.log.bind(console);
var q = require('q');

var url = c.url.mongo + c.db.fatalities;

MongoClient.connect(url, function(err, db) {

    if (err) throw err;

    var collection = db.collection(c.collection.import);

    var test = {

    };

    find(collection, test)
        .then(log)
        .catch(log)
        .then(process.exit)

});

function promiseify(db) {
    return {
        find: function(query, cb) {

        },
        insert: function() {

        }
    }
}

function find(collection, query) {
    var deferred = q.defer();
    collection.find(query).toArray(function(err, result) {
        if (err) {
            deferred.reject(err);
        } else {
            deferred.resolve(result);
        }
    });
    return deferred.promise;
}

function insert(collection, record) {
    var deferred = q.defer();
    collection.insert(record, function(err, result) {
        if (err) {
            deferred.reject(err);
        } else {
            deferred.resolve(result.ops);
        }
    });
    return deferred.promise;
}