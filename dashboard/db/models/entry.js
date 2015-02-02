/*
 * Entry Model
 * This model is for interacting with the 
 */

var c = require('../../config/constants');
var nano = require('nano')(c.nano);
var db = nano.use(c.db_name);

var entry = {
    
    readd: function(designDoc, func, params, cb){
        params = typeof params !== 'undefined' ? params : {};
        callback = typeof callback === 'function' ? callback : function(){};
        db.view(designDoc, func, params, function(err,body){
            if(err) throw err;
            cb(body);
        });
    },

    read: function(params, callback){
        params = typeof params !== 'undefined' ? params : {};
        callback = typeof callback === 'function' ? callback : function(){};
        db.view('basic', 'all', params, function(err,body){
            if(err) throw err;
            callback(body);
        });
    },

    update: function(id, entry, callback){
        var output = {success: false};
        var failed = false;
        callback = typeof callback === 'function' ? callback : function(){};
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
            db.get(id,{revs_info: true},function(err,body){
                if(err){
                    if(err.statusCode === 404){
                        output.reason = 'invalid id';
                    }else{
                        output.reason = 'db error';
                        output.message = err;
                    }
                    callback(output);
                }else{
                    entry._rev = body._rev;
                    db.insert(entry,id,function(err,body){
                        if(err){
                            output.reason = 'db error';
                            output.message = err;
                        }else{
                            output.success = true;
                            output.results = body;
                        }
                        callback(output);
                    })
                }
            });
        }else{
            callback(output);
        }
    },
    
    create: function(entry, callback){
        var output = {success: false};
        var failed = false;
        callback = typeof callback === 'function' ? callback : function(){};
        
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
        var output = {success: false};
        if(typeof id !== 'string'){
            output.reason = 'invalid id';
            callback(output);
        }else{
            db.get(id,{revs_info: true},function(err,body){
                if(err){
                    if(err.statusCode === 404){
                        output.reason = 'invalid id';
                    }else{
                        output.reason = 'db error';
                        output.message = err;
                    }
                    callback(output);
                }else{
                    body._deleted = true;
                    db.insert(body,id,function(err,body){
                        if(err){
                            output.reason = 'db error';
                            output.message = err;
                        }else{
                            output.success = true;
                            callback(output);
                        }
                    });
                }
            });
        }
    }
}
module.exports = entry;