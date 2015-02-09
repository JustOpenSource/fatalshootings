var __base = __base || '../../',
    c = require(__base + 'config/constants'),
    _ = require('underscore'),
    fs = require('fs'),
    DocCreator = require(__base + 'db/utils/create-doc'),
    nano = require('nano')(c.nano),
    confirmDb = require(__base + 'db/utils/create-db');
    metaDir = 'db/meta_docs/',
    designDocFiles = fs.readdirSync(__dirname + '/' + __base + metaDir),
    docs = [],
    processedDoc = false;


function set(db, doc, cb){
    var documentCreator = new DocCreator(db);

    documentCreator.set({        
        "doc" : doc,
        "cb" : cb
    });
}

function insertComplete(err, body){
    if(!err){
        c.l('callback error', err);
    } else {
        c.l('callback success');
    }
}

function processDocs(db){
    _.each(designDocFiles, function(doc){
        docs.push(require(__base + metaDir + doc));
    });

    _.each(docs, function(doc){
        doc(function(processedDoc){
            c.l('inside meta callback');

            set(db, processedDoc, insertComplete);
        });
    });
}

confirmDb(c.db_meta, function(db){
    processDocs(nano.use(db));
});