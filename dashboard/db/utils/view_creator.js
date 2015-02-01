var __base = __base || '../../',
    c = require(__base + 'config/constants'),
    nano = require('nano')(c.nano),
    db = nano.use(c.db_name);

var creator = {
    insert: function(designDoc, callback){
        var validated = false;

        callback = (typeof callback === 'function') ? callback : function(){};
        
        if(
            typeof designDoc.name === 'string' ||
            typeof designDoc.views === 'object'
        ) {
            validated = true; 
        }
        
        if(validated) {
            designDoc._id = '_design/' + designDoc.name;
            designDoc.language = 'javascript';

            db.insert(designDoc, designDoc._id, function(err, body){
                if (!err) {
                    callback(body);
                } else {
                    callback(false, err);
                }
            });
        } else {
            callback(false, 'invalid designDoc');
        }
    }
}


module.exports = creator;