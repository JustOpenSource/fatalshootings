var __base = __base || '../../',
    c = require(__base + 'config/constants'),
    nano = require('nano')(c.nano);

var DocCreator = function(db){

	var t = this;

	t.db = db;

	/**
	o = {
		"cb" : callback function
		"validateCb" : validator function, returns true or false,
		"doc" : document object
		"id" : document id
	}
	*/
    t.set = function(o){
    	
    	var validated = o.validateCb ? o.validateCb(o.doc) : true,
    		cb = (typeof o.cb === 'function') ? o.cb : function(){},
    		adjustDoc = (typeof o.adjustDoc === 'function') ? o.adjustDoc : function(doc){ 
    			return doc; 
    		};

        if(!validated){

        	c.l('validation failed', validated);
        	
        	validateCb('error: validation failed')

        	return false;
        
        }

        function insert(doc, rev){
        	
        	var id = (doc.id) ? doc.id : null;

        	if(rev){
        		doc._rev = rev;
        	}
            
            t.db.insert(doc, id, function(err, insertDoc){
                
            	c.l('insert on complete');

                if (err && err.error === 'conflict'){

                    c.l('insert failed: conflict');
                    get(doc, id);

                } else if (err && err.reason === 'no_db_file'){

                    c.l('insert failed: database does not exist');
                    cb(err);

                } else if (err){

                    c.l('insert failed: other', err);
                    cb(err);
                
                } else {
                    
                    c.l('insert success', doc);
                
                }

            });
        }

        function get(doc, id){
            
            t.db.get(id, function (err, gotDoc) {
                
                if(err){
                    
                    c.l('get failed', err);
                
                } else {
                    
                    c.l('attempting update');
                    insert(doc, gotDoc._rev);
                
                }
                
            });
        }

        insert(adjustDoc(o.doc));
    }
}

var d = new DocCreator(nano.use(c.db_meta));

/*
d.set({
	"doc" : {
		"id" : "_design/foo",
		"foo":"bar2"
	},
})
*/

module.exports = DocCreator;