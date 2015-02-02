var __base = __base || '../../',
    c = require(__base + 'config/constants'),
    _ = require('underscore'),
    fs = require('fs'),
    viewCreator = require(__base + 'db/utils/view_creator'),
    designDocs = [];

var designDocFiles = fs.readdirSync(__dirname + '/' + __base + 'db/design_documents');

_.each(designDocFiles, function(doc){
    designDocs.push(require(__base + 'db/design_documents/' + doc));
});

function insertComplete(body, errMsg){
    if(!errMsg){
        c.l('callback error');
    } else {
        c.l('callback success');
    }    
}

_.each(designDocs, function(designDoc){
    
    c.l('create design doc: ' + designDoc.name);
    
    viewCreator.insert(designDoc, insertComplete)

});