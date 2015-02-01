var __base = __base || '../../',
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
        console.log('designDoc insertComplete');
        console.log(body);
    } else {
        console.log(errMsg);
    }    
}

_.each(designDocs, function(designDoc){
    viewCreator.insert(designDoc, insertComplete)
});