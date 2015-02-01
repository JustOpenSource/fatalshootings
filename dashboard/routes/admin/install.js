var express = require('express'),
    router = express.Router(),
    _ = require('underscore'),
    c = require(__base + 'config/constants.js'),
    nano = require('nano')(c.nano),
    data = require(__base + 'db/sample_data/pfcdata.js');
    databaseName = c.db_name,
    pfdb = null,
    view_creator = require(__base + 'db/utils/view_creator');

//ROUTES
router.get('/',function(req, res){
    createDb(res);
});

var createDatabaseActions = [];

//FUNCTIONS
//create the database
//TODO: make this self loop so it can handle a DB that is already created;
//TODO: make this also write insert necessary views
function createDb(res){
    nano.db.create(databaseName, function(err, body) {
        if (!err) {
            console.log(databaseName + ' created!');
            
            pfdb = nano.use(databaseName);
            
            var view = {},
                view_name = 'basic';

            view.views = {
                'all': {
                    'map': function(doc){
                        if(doc._id.indexOf('fatality') === 0){
                            emit(doc._id,doc.value);
                        }
                    }
                },
                'highest_id': {
                    'map': function(doc){
                        if(doc._id.indexOf('fatality') === 0){
                            var out = parseInt(doc._id.replace('fatality_','')); 
                            emit(out,out);
                        }
                    },
                    'reduce': '_stats'
                }
            };
            view_creator.insert(view,view_name,function(){
                createDatabaseActions.push({
                    label: 'View',
                    value: 'Created "all" and "highest_id" view for "_design/basic"'
                });
                addRecords();

                handleResponse(res, {
                    'title' : 'Success!',
                    'message' : 'Database is now available.',
                    'actions' : createDatabaseActions,
                    'database' : databaseName
                });
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
    console.log('Finished Inserting');
}

function handleResponse(res, output){
    output = {
        title: output.title || '', 
        message: output.message || '', 
        actions: output.actions || [],
        database: output.database || null
    };

    res.render('admin/normalization/explore/install', output);
}

module.exports = router;