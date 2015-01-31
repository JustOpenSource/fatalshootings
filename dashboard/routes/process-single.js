var _ = require('underscore'),
	validate = require('../db/utils/validator');

function process(entry){
    console.log('processing entry');
    //console.log(validate.schemas);
    console.log(validate.schemas['/fe/death/v1'].properties.cause.enum);
    console.log(entry);

    if(!entry){
    	return {};
    }
    entry.form = {};
    entry.form.causesOfDeath = validate.schemas['/fe/death/v1'].properties.cause.enum;
    return entry;


}

module.exports = process;