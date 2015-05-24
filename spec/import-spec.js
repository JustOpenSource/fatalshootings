var Import      = require('./../shared-utils/import');
var c           = require('./../shared-config/constants');
var Mongo       = require('mongodb');
var q           = require('q');
var MongoClient = Mongo.MongoClient;
var ObjectId    = Mongo.ObjectID;
var url         = c.url.mongo + c.db.fatalities;
var log         = console.log.bind(console);
var hurl        = function(err) { log(err.stack || err.message || err.error || err); process.exit(); };

describe('import system', function() {

    var db;

    // Connect to database
    beforeAll(function (done) {
       MongoClient.connect(url, function(err, _db) {
            if (err) throw err;
            db = _db;
            done();
        });
    });

    describe('singleImport method', function() {

        var record = {
            "death": {
                "cause": "gunshot",
                "cause_notes": "",
                "responsible_agency": "Miami Beach Police",
                "description": "Police tried to stop Herisse’s speeding four-door Hyundai as it barreled down a crowded Collins Avenue.",
                "disposition": "justified",
                "source_url": "http://www.miamiherald.com/2013/04/10/3336557/lab-report-man-slain-in-wild-sobe.html#storylink=cpy",
                "event": {
                    "address": "18th Street and Collins Avenue",
                    "date": "5/30/2011"
                }
            },
            "subject": {
                "age": "22",
                "sex": "male",
                "name": "Raymond Herisse",
                "race": " African-American/Black",
                "image_url": "http://media.miamiherald.com/smedia/2013/04/10/21/29/39hD9.Em.56.jpeg",
                "mental_illness": "Unknown"
            },
            "location": {
                "city": "South Beach, Miami Beach, Florida",
                "county": "Miami-Dade",
                "state": "FL",
                "zipcode": "33139"
            },
            "submitted_by": "Burghart",
            "published": false
        };

        beforeAll(function(done) {
            var collection = db.collection(c.collection.import);
            // Clear out the collection
            q.nfcall(collection.remove.bind(collection), {})
                .then(done)
        });

        describe('with no existing records', function() {

            var importedRecord;

            beforeAll(function(done) {
                Import.singleImport(db, record)
                    .then(function(_importedRecord) {
                        // Save the returned result
                        importedRecord = _importedRecord.ops[0];
                    })
                    //.catch(hurl)
                    .then(done);
            });

            it('creates a record in the import collection', function(done) {

                db.collection(c.collection.import)
                    .find(record)
                    .toArray(function(err, res) {
                        expect(err).toBe(null);
                        expect(res[0]).toEqual(record);
                        delete record._id;
                        done();
                    });
            });

            it('returns an imported record with hash and a guid', function() {
                expect(importedRecord).toBeDefined();
                expect(importedRecord._hash).toBeDefined();
                expect(importedRecord._guid).toBeDefined();
                expect(importedRecord._status).toBeDefined();
            });

            it('creates a record in the pending collection');

        });

        describe('trying to import a record twice', function() {

            var importError;
            var importedRecord;

            beforeAll(function(done) {

                Import.singleImport(db, record)
                    .then(function(_importedRecord) {
                        // Save the returned result
                        importedRecord = _importedRecord.ops[0];
                    })
                    .catch(function(err) {
                        importError = err;
                    })
                    .then(done);
            });

            it('should throw an error', function() {
                expect(importError).toBeDefined();
                expect(importError.reason).toEqual('record already exists');
                expect(importedRecord).toBeUndefined();
            });

        });

    })

});