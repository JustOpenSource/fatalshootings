var c = require('../../config/constants');
var nano = require('nano')(c.nano);
var db = nano.use(c.db_name);

var creator = {
    insert: function(views, name, callback){
        var failed = false;
        calllback = typeof callback === 'function' ? callback : null;
        if(typeof name !== 'string'){
            failed = true;
        }
        
        if(!failed){
            if(typeof views !== 'object'){
                failed = true;
            }else{
                views.language = 'javascript';
            }
        }
        
        if(!failed){
            db.insert(views, '_design/'+name, function(err,body){
                if(err) throw err;
                callback(body);
            });
        }else{
            callback();
        }
    }
}


module.exports = creator;