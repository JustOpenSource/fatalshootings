/*
 * Entry Model
 * This model is for interacting with the 
 */

var c = require('../../config/constants');
var nano = require('nano')(c.nano);
var db = nano.use(c.db_name);

var entry = {
    read: function(params, callback){
        params = typeof params !== 'undefined' ? params : {};
        callback = typeof callback !== 'function' ? callback : null;
        db.view('basic','all',params,function(err,body){
            if(err) throw err;
            callback(body);
        });
    },
    update: function(id, entry, callback){
        var output = {success: false};
        var failed = false;
        callback = typeof callback === 'function' ? callback : null;
        if(typeof id !== 'string'){
            output.reason = 'invalid id';
            failed = true;
        }
        if(!failed){
            if(typeof entry !== 'object'){
                output.reason = 'entry data in wrong format';
                failed = true;
            }
        }
        if(!failed){
            //data validation
            if(!true){
                output.reason = 'failed validation';
                failed = true;
            }
        }
            
        if(!failed){
            //run update query
        }else{
            callback(output);
        }
    },
    create: function(entry, callback){
        var output = {success: false};
        var failed = false;
        callback = typeof callback === 'function' ? callback : null;
        
        if(typeof entry !== 'object'){
            output.reason = 'entry data in wrong format';
            failed = true;
        }
        
        if(!failed){
            //data validation
            if(!true){
                output.reason = 'failed validation';
                failed = true;
            }
        }
            
        if(!failed){
            //get next id
            db.view('basic','highest_id',function(err,body){
                if(err){
                    output.reason = 'db error';
                    output.message = err;
                    callback(output);
                }else{
                    var max = body.rows[0].value.max;
                    key = c.id_prefix + (max + 1);
                    db.insert(entry,key,function(err,body){
                        if(err){
                            output.reason = 'insert error';
                            output.message = err;
                        }else{
                            output.success = true;
                            output.result = body;
                        }
                        callback(output);
                    });
                }
            });
            //insert row
        }else{
            callback(output);
        }
    },
    delete: function(id, callback){
        
    }
}
module.exports = entry;