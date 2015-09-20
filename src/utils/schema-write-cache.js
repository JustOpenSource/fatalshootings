var __base = __base || '../';
var c = require(__base + 'constants');
var log = require(__base + 'utils/log')('utils/schema-write-cache');
var schema = require(__base + 'utils/schema');
var fs = require('fs');

var SCHEMA_DIR = __dirname + '/' + __base + 'schemas-cache/';

module.exports = function(name, version){

	log('trace', 'get schema ' + name + '.' + version);

	var feSchema = schema.getFullSchema(name, version);

	if(!feSchema){

		log('error', 'cannot get schema ' + name + '.' + version);

		return;

	}

	log('trace', 'write schema ' + name + '.' + version);
	    
	fs.writeFile(SCHEMA_DIR + name + '.' + version + '.json', JSON.stringify(feSchema), function (err) {
        
        if (err) {

        	log('error', 'could not write to ' + SCHEMA_DIR + name + '.' + version + '.json');

        	return;
        }

        log('trace', 'updated schema ' + name + '.' + version);
    });

}