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
        name: 'Joshua',
        age: 26
    };

    insert(collection, test)
        .then(function(res) {
            log('insert', res, 'results');
        })
        .then(function() {
            return find(collection, { _id: ObjectId('555f276a320987c420d93033') });
        })
        .then(function (res) {
            log('find', res, 'results');
        })
        .catch(function(err) {
            throw err;
        })
        .then(function() {
            db.close();
        });

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