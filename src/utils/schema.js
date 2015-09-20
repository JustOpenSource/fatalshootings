var __base = __base || '../';
var c = require(__base + 'constants');
var log = c.getLog('utils/schema');
var _ = require('underscore');

//TODO: Make this function recursive
function getFullSchema(name, version){
	var schemaPath =  __base + 'schemas/';
	var rootSchema = require(schemaPath + name + '.' + version + '.json');

	rootSchema.properties = _.mapObject(rootSchema.properties, function(val, key) {
  		
		if(val.type && val.type['$ref']){
			val.type.schema = require(schemaPath + val.type['$ref'] + '.json');
		}

		return val;
	});

	return rootSchema;
}

module.exports = {
	getFullSchema : function(name, version){
		return getFullSchema(name, version);
	}
}