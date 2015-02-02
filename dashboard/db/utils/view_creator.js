var __base = __base || '../../',
    c = require(__base + 'config/constants'),
    nano = require('nano')(c.nano),
    db = nano.use(c.db_name);

var creator = {

    insert: function(designDoc, cb){
        
        var validated = false;

        callback = (typeof callback === 'function') ? callback : function(){};
        
        if (typeof designDoc.name === 'string' && typeof designDoc.views === 'object') {          
            validated = true; 
        }

        function insert(designDoc){
            
            db.insert(designDoc, designDoc._id, function(err, doc){
                
                if (err.error === 'conflict'){

                    c.l('insert failed: conflict');
                    get(designDoc);

                } else if (err){

                    c.l('insert failed: other', err);
                    cb(callback(err));
                
                } else {
                    
                    c.l('insert success', designDoc._id);
                
                }

            });
        }

        function get(designDoc){
            
            db.get(designDoc._id, function (err, doc) {
                
                if(err){
                    
                    c.l('get failed', err);
                
                } else {
                    
                    c.l('attempting update');
                    update(designDoc, doc);
                
                }
                
            });
        }

        function update(designDoc, doc){
            
            designDoc._rev = doc._rev;

            db.insert(designDoc, designDoc._id, function(err, doc){
                
                if (err) {
                    
                    c.l('update failed', err);
                    cb(err);

                } else {

                    c.l('update success', designDoc);
                    cb(null, doc);
                
                }
            
            });
        }
        
        if(validated) {
            
            designDoc._id = '_design/' + designDoc.name;
            designDoc.language = 'javascript';
        
            insert(designDoc);
        
        } else {

            cb('error: invalid designDoc');
        
        }
    }
}

module.exports = creator;