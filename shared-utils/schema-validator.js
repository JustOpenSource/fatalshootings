var __base = __base || '../',
    c = require(__base + 'shared-config/constants'),
    log = c.getLog('shared-utils/http-get'),
    _ = require('underscore');

//https://www.npmjs.com/package/jsonschema
    jsonvalidator = require('jsonschema'),

    validate = jsonvalidator.validate,
    Validator = jsonvalidator.Validator,

//variables
    schema = {},
    v = new Validator(),
    schemaPath = './schemas/',
    schemas = ['entry', 'encounter', 'death', 'loc', 'subject'];

//add schemas to Validator
_.each(schemas, function(value, i){
    v.addSchema(require(schemaPath + value + '.json'));
});

function schemaValidator(d){
    var validated = v.validate(d, v.schemas['/fe/entry/v1']);
    return validated ;
};

var testEntry = {
    submitted_by: '',
    published: true,
    subject: {
        "age" : 3,
        "sex": "male",
        "name" : "string",
        "race" : "string",
        "image_url" : "string",
        "mental_illness" : "string"
    }
}


//schemaValidator(testEntry);

log('trace', 'validator', schemaValidator(testEntry));

module.exports = schemaValidator