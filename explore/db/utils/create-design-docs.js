var __base = __base || '../../',
    c = require(__base + 'config/constants'),
    _ = require('underscore'),
    fs = require('fs'),

    DocCreator = require(__base + 'db/utils/create-doc'),
    
    nano = require('nano')(c.nano),
    db = nano.use(c.db_name),
    designDocFiles = fs.readdirSync(__dirname + '/' + __base + 'db/design_docs'),
    designDocs = [];

_.each(designDocFiles, function(doc){
    designDocs.push(require(__base + 'db/design_docs/' + doc));
});

function set(designDoc, cb){
    var doc = new DocCreator(db);

    doc.set({
        
        "doc" : designDoc,
        "cb" : cb,
        
        "validateCb" : function(d){
            if (typeof d.name === 'string' 
                && typeof d.views === 'object') {          
                
                return true;
            
            } else {
                return false;
            }
        },

        "adjustDoc" : function(d){
            d.id = '_design/' + d.name;
            delete d.name;
            d.language = 'javascript';

            return d;
        }
    });
}

function insertComplete(err, body){
    if(!err){
        c.l('callback error');
    } else {
        c.l('callback success');
    }    
}

_.each(designDocs, function(designDoc){
    
    c.l('create design doc: ' + designDoc.name);
    set(designDoc, insertComplete);

});