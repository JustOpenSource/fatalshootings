var express = require('express'),
    router = express.Router(),
    _ = require('underscore'),
    c = require('../config/constants.js'),
    nano = require('nano')('http://localhost:5984'),
    data = require('../db/sample_data/pfcdata.js');
    databaseName = c.db_name,
    pfdb = null;

//ROUTES
router.get('/',function(req, res){
    createDb(res);
});

var createDatabaseActions = [];

//FUNCTIONS
//create the database
function createDb(res){
    nano.db.create(databaseName, function(err, body) {
        if (!err) {
            console.log(databaseName + ' created!');
            
            pfdb = nano.use(databaseName);

            addRecords();

            handleResponse(res, {
                'title' : 'Success!',
                'message' : 'Database is now available.',
                'actions' : createDatabaseActions,
                'database' : databaseName
            });

        } else {
            createDatabaseActions.push({
                label: 'Error',
                value: err
            });

            createDatabaseActions.push({
                label: 'Body',
                value: body
            });

            handleResponse(res, {
                'title' : 'Error',
                'message' : 'Database was not created.',
                'actions' : createDatabaseActions
            });
        }
    });
}

//add the record set to a database
function addRecords(){
    _.each(data.rows, function(item, i){
        pfdb.insert(item, item.id, function(err, body, header) {
            console.log('[' + databaseName + '.insert] ' + item.id);
                
            if (err) {
                console.log(err)
                createDatabaseActions.push({
                    label: 'Record Creation Error',
                    value: item.id
                });

                return;
            }
        });
    });
}

function handleResponse(res, output){
    output = {
        title: output.title || '', 
        message: output.message || '', 
        actions: output.actions || [],
        database: output.database || null
    };

    res.render('explore/install', output);
}

module.exports = router;