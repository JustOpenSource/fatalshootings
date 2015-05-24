var log = console.log.bind(console);

var Import = require('./import');

var _db = {};

var db = {
    findBy: function (key, value, cb) {
        setTimeout(function() {
            if (Math.random() >.001) {
                cb(null, _db[key] === value);
            } else {
                cb('i/o error on findBy');
            }
        }, 1000);
    },
    insert: function (record, cb) {
        setTimeout(function() {
            if (Math.random() >.001) {
                _db[record.hash] = record;
                cb(null, record);
            } else {
                cb('i/o error on findBy');
            }
        }, 1000);
    }
};

var arry = require('../sys-admin/sample-data/fejson').rows.map(function(n) { return n.value });

var start = new Date();

Import
    .bulkImport(db, arry)
    .then(function(res) {
        var end = new Date();
        console.log(res.passed.length, 'passed');
        console.log(res.failed.length, 'failed');
        //console.log(res);

        console.log(arry.length, 'records imported in', (end-start) / 1000, 'seconds');
    })
    .catch(log);
