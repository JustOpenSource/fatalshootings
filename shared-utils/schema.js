var __base = __base || '../',
	c = require(__base + 'shared-config/constants'),
	log = c.getLog('shared-utils/schema'),
	_ = require('underscore');

//TODO: Make this function recursive
function getFullSchema(name, version){
	var schemaPath = './schemas/';
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