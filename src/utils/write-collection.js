var __base = __dirname;
var log = require('./log')(__dirname);
var q = require('q');
var Db = require('./db-drivers/dynamodb');

const dbInstance = new Db({
    'table' : 'sdf-test2'
});

const FILENAME = 'db-dump-test2.json';

function writeResults(collection){
    var fs = require('fs');
    fs.writeFile(__dirname + '/../../data/' + FILENAME, JSON.stringify({ items: collection }), function(err) {
        if(err) {
            console.log(err);
        } else {
            console.log("The file was saved!");
        }

        
    }); 
}

function getResults(data){
    
    data.filter = {};
    dbInstance.getResults(data.filter, (err, response)=>{

            if(err){
                log('error', 'could not get results', err);
                deferred.reject(err);
            }

            data.count = response.count;
            data.body = response.Items;

            log('trace', 'results', data.count);
            log('trace', 'results', dbInstance.tempCollection);

            writeResults(dbInstance.tempCollection);
        }
    );
}

getResults({});