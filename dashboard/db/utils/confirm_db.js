var __base = __base || '../../',
    c = require(__base + 'config/constants'),
    nano = require('nano')(c.nano);

function confirmDb(dbName, cb){
	
    function create(){
        nano.db.create(c.db_meta, function(err, response) {
            if(err){
                c.l('error: creating meta db');
            } else {
                return cb(dbName);
            }
        });
    }

    nano.db.get(c.db_meta, function(err, response) {
        if(err){
            create()
        } else {
            return cb(dbName); 
        }
    });
}

module.exports = confirmDb;