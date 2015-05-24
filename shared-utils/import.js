/**
 * Import -- Bring data from various sources into the Import database
 *
 * Data flow:
 *  1. Put data into import
 *      a. Check if data in import
 *      b. Add unique ID
 *      c. Mark as pending
 *
 * 2. Stage data in pending based on previous mappings, if any
 *      a. Straight match -- based on fields for each value, pull mapped value
 *      b. Fuzzy match
 *
 *  3. Change data in pending to pass validations
 *
 *
 *  4. Promote pending data to production

 */

// Dependencies
var __base = __base || '../';
var c = require(__base + 'shared-config/constants');
var log = c.getLog('shared-utils/import');
var q = require('q');
var mappable = []


/**
 * Throw error by passing in string or error
 */
var toss = function(e) {
    if (typeof e === 'string') e = new Error(e);
    e.stack = e.stack.split('\n')[0] + '\n' + e.stack.split('\n').slice(1).join('\n');
    throw e;
};

var Import = {};

// Can be called from request
Import.singleImport = function singleImport(db, records, cb) {
    var collection = getCollection(db, c.collection.import); //db.collection(c.db.import);
    return _singleImport(collection, records, cb);
};

// Can be called from request
Import.bulkImport = function bulkImport(db, records, cb) {
    // Use collection 'import'
    var collection = getCollection(db, c.collection.import);
    return _bulkImport(collection, records, cb);
};

module.exports = Import;


// Helper functions

/**
 * Import an array of records into the db
 * Assumes db is connected and pointed to import database
 * Returns promise that resolves w/ map of inserted and failed records:
 *      {
 *          passed: [<record>],
 *          failed: [ { reason: <error>, record: <record> } ]
 *      }
 */
function _bulkImport(db, records, cb){
    return q.try(function() {

        log('trace', 'bulk import started');

        // Do each insert individually
        var singleInsertPromises = records.map(function(record) {
            return _singleImport(db, record);
        });

        return q
            .allSettled(singleInsertPromises)
            .then(groupResults);

        function groupResults(results) {
            return results.reduce(function(memo, curr) {
                if (curr.state === 'fulfilled') {
                    memo.passed.push(curr.value);
                } else {
                    memo.failed.push(curr.reason);
                }
                return memo;
            }, {
                passed: [],
                failed: []
            });
        }

    }).tap(writeSuccessLog).nodeify(cb);

    function writeSuccessLog() {
        log('trace', 'bulk import complete');
    }
}

/**
 * Import a single record into the db
 * Assumes db is connected and pointed to import database
 * Returns promise that
 *      (1) resolves w/ inserted record -- <record>
 *          or
 *      (2) throws with failed record and reason -- { reason: <error>, record: <record> }
 */
function _singleImport(db, record, cb) {
    return q.try(function() {

        log('trace', 'single import started');

        return q.resolve()
            .then(checkIfRecordExists)
            .then(calcGuidAndInsert)
            .tap(writeSuccessLog)
            .then(insertIntoPending)
            .catch(formatImportError);

        function checkIfRecordExists () {
            // Hash
            record._hash = makeHash(record);

            // Check if data in import
            var query = db.find({ _hash: record._hash});

            return q.nfcall(query.toArray.bind(query))
                .then(function(res) {
                    return res.length !== 0;
                });
        }

        function calcGuidAndInsert(exists) {
            if (exists) {
                toss('record already exists');
            } else {
                // Add unique ID
                record._guid   = makeGuid();

                // Mark as pending
                record._status = 'pending';

                // Insert into DB
                // Todo: Replace with actual db call
                return q.nfcall(db.insert.bind(db), record);
            }
        }

        function writeSuccessLog() {
            log('trace', 'single import complete')
        }

        function insertIntoPending(record) {
            var mappedRecord = generateMappedRecord(record);

            // Insert into pending, replacing existing on GUID match
            var pendingCollection = getCollection(db, 'pending');

            // Promiseify
            return q.nfcall(pendingCollection.insert.bind(pendingCollection), mappedRecord);
        }

        function annotateError() {

            var name = arguments.callee.caller.name + ' failed; ';
            return function(err) {
                console.log(err, err.stack, err.message);
//                console.log('typeof', typeof err);
                if (typeof err === 'string') {
                    err = new Error(name + err);
                } else {
                    err.message = name + err.message;
                }

                throw err;
            }
        }

        function formatImportError(error) {
            log('trace', 'single import failed');
            throw {
                reason: error.message,
                stack:  error.stack,
                error:  error,
                record: record
            };
        }

    }).nodeify(cb)
}

function getMapping(db, key) {
    var collection = getCollection(db, 'mappings');
    collection.find({  })
}



/**
 * Calculates the "best guess" of each record's normalized values
 * based on previous approved mappings, and inserts those values
 * into the pending colllection
 */
function singleInsertIntoPending(db, record) {
    var mappedRecord = generateMappedRecord(record);

    // Insert into pending, replacing existing on GUID match
    var pendingCollection = getCollection(db, 'pending');

    // Promiseify
    return q.nfcall(pendingCollection.insert.bind(pendingCollection), mappedRecord);
}

function generateMappedRecord(record) {
    // Poor man's clone
    // Todo(Joshua): Use actual clone method from util
    var mappedRecord = JSON.parse(JSON.stringify(record))
    delete mappedRecord._id; // Just in case
    return mappedRecord;
}

/**
 * Makes a hash for a record based on a predefined set of unique keys
 */
function makeHash(record) {

    // Keys that should be unique between input entries
    var hashKeys = ['subject.name', 'subject.age', 'subject.sex'];
    var str = '';
    hashKeys.forEach(function(key) {
        var path = key.split('.');
        var val = record[path[0]];
        for (var i = 1; i < path.length; i++) {
            val = val[path[i]]
        }
        str += val || '';
    });

    return hashFnv32a(str, true);

    // http://stackoverflow.com/a/22429679/1623877
    function hashFnv32a(str, asString, seed) {
        /*jshint bitwise:false */
        var i, l,
            hval = (seed === undefined) ? 0x811c9dc5 : seed;

        for (i = 0, l = str.length; i < l; i++) {
            hval ^= str.charCodeAt(i);
            hval += (hval << 1) + (hval << 4) + (hval << 7) + (hval << 8) + (hval << 24);
        }
        if( asString ){
            // Convert to 8 digit hex string
            return ("0000000" + (hval >>> 0).toString(16)).substr(-8);
        }
        return hval >>> 0;
    }
}

/**
 * http://stackoverflow.com/a/2117523/1623877
 */
function makeGuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
    });
}

/**
 * Take a "db" reference, which may actually be a collection
 * and get a specific collection by name
 */
function getCollection(db, collection) {
    if (db.s && db.s.db) {
        // If passed in a collection, get the db reference and switch collections
        return db.s.db.collection(collection);
    } else {
        // If passed in a db, just get the collection
        return db.collection(collection);
    }
}