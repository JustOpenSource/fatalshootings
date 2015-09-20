var __base = __base || '../';
var c = require(__base + 'constants');
var log = require(__base + 'utils/log')('utils/schema-validator');
var _ = require('underscore');
var jsonvalidator = require('jsonschema');

var validate = jsonvalidator.validate;
var Validator = jsonvalidator.Validator;
var v = new Validator();

var schemaPath = __base + 'schemas/',
var schemas = ['entry', 'death', 'location', 'person'];

//add schemas to Validator
_.each(schemas, function(value, i){
    v.addSchema(require(schemaPath + value + '.json'));
});

function schemaValidator(d){

    var allErrors = [];

    function subValidate (schema) {
        var schemaPath = '/fe/' + schema + '/v1';
            subValidated = v.validate(d[schema], v.schemas[schemaPath]),
            subErrors = _.values(subValidated.errors);

        _.each(subErrors, function(err, i){
            subErrors[i].location = schema;
        })

        log('trace', 'subErrors', subErrors);

        return subErrors;
    }

    var validated = v.validate(d, v.schemas['/fe/entry/v1']),
        errors = _.values(validated.errors),
        instance = '';

    log('trace', 'errors', errors);

    if(errors){

        _.each(errors, function(err, i){

            //TODO: use schema array to make this simpler
            //TODO: turn this into a loop and find a better way to identify sub schemas
            if (err.property === 'instance.subject') {

                allErrors = allErrors.concat(subValidate('subject'));

            } else if (err.property === 'instance.death') {

                allErrors = allErrors.concat(subValidate('death'));

            } else if (err.property === 'instance.location') {

                allErrors = allErrors.concat(subValidate('location'));

            } else if (err.property === 'instance.encounter') {

                allErrors = allErrors.concat(subValidate('encounter'));

            } else if (err.property) {

                allErrors = allErrors.concat([errors[i]]);

            }
        });
    }

    return allErrors;
}

/*
var testEntry = {
    "submitted_by" : 'a. person',
    "published" : 'adsf',
    "subject" : {

        "age" : 55,
        "sex": "male",
        "cis" : 3,
        "name" : "string",
        "race" : "string",
        "image_url" : "string",
        "mental_illness" : "string"
    },

    "death" : {

        "cause" : "drug sa",
        "cause_notes" : "",
        "responsible_agency" : 1,
        "description" : "lorum ispum",
        "dated_description" :"lorum ispum",
        "disposition" : "lorum ispum",
        "source_url" : "http://lorumispum"
    },

    "encounter" : {
        "address": "string",

        "date": 20132302
    },

    "location" : {

        "coordinates" : {
            "latitude" : 24.003,
            "longitude" : 432.222
        },

        "country" : {

            "USA": {

                "city": {
                    "type": "string"
                },

                "countsubjecty": {
                    "type": "string"
                },

                "state": "MD",

                "zipcode": {
                    "pattern": "^[0-9]{5}(?:-[0-9]{4})?$"
                }
            }
        }
    }
}

log('info', 'validator', schemaValidator(testEntry));
/**/

module.exports = schemaValidator;