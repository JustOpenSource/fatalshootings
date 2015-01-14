//require
var _ = require('underscore'),
	nano = require('nano')('http://localhost:5984'),
	data = require('../sample_data/pfdata.js'),
	pfdb = nano.use('pf'),
	//https://www.npmjs.com/package/jsonschema
	jsonvalidator = require('jsonschema'),

	//validate
	validate = jsonvalidator.validate,	
	Validator = jsonvalidator.Validator,
	
	//variables
	schema = {},
	v = new Validator(),
	schemaPath = '../schemas/',
	schemas = ['entry', 'encounter', 'death', 'loc', 'subject'];

//add schemas to Validator
_.each(schemas, function(value, i){
	v.addSchema(require(schemaPath + value + '.json'));
});

//confirm Validators
console.log(v);