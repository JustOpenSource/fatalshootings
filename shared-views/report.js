var __base = __base || '../',
    c = require(__base + 'shared-config/constants'),
    log = c.getLog('shared-views/report'),

	_ = require('underscore');

var MISSING_CLASS = 'fe-report-required-missing';

function setMissingTemplateVars(missing){
    if(!missing){
        return;
    }

    var requiredMissing = {};

    _.each(missing.split(","), function(missing){
        requiredMissing[missing] = MISSING_CLASS;
    });

    return requiredMissing;
}

function formatValuesForForm(report){

	//make sure root objects are available
	//in case where no values are set as query params yet
    if(!report.subject){
        report.subject = {};
    }

    if(!report.death){
        report.death = {};
    }

    if(!report.location){
        report.location = {};
    }

    report.optionValues = {
        'age' : ageOptions(report.subject.age),
        'sex' : sexOptions(report.subject.sex),
        'orientation' : orientationOptions(report.subject.orientation),
        'cisgendered' : cisgenderedOptions(report.subject.cisgendered),
        'race' : raceOptions(report.subject.race),
        'countries' : countriesOptions(report.location.country),
        'mentalIllness' : mentalIllnessOptions(report.subject.mental_illness),
        'causeOfDeath' : causeOfDeathOptions(report.death.cause),
        'disposition' : dispositionOptions(report.death.disposition),
    }

    return report;
}

function generateOptions(options, selected){
    var optionsObj = [];

    _.each(options, function(curr){
        optionsObj.push({
            'selected' : selected == curr ? true : false,
            'value' : curr,
            'text' : curr
        });
    });

    return optionsObj;
}


/*
TODO: Generate option values from schema
*/
function ageOptions(selected){
    var ages = [],
        upperLimit = 120,
        curr = 1;

    selected = parseInt(selected);

    while(curr <= upperLimit){
        
        ages.push({
            'selected' : selected === curr ? true : false,
            'value' : curr,
            'text' : curr
        });

        curr++;
    }

    return ages;
}

function sexOptions(selected){

    return generateOptions([
    	'male', 
    	'female', 
    	'intersex'], selected);
}

function orientationOptions(selected){

    return generateOptions([
    	'heterosexual', 
    	'homosexual', 
    	'bisexual', 
    	'other'], selected);
}

function cisgenderedOptions(selected){

    return generateOptions([
    	'cisgender', 
    	'transgender'], selected);
}

function raceOptions(selected){

    return generateOptions([
    	'White / European', 
        'Asain Indian',
        'Middle Eastern',
        'Black / African American',
        'Native American or Alaska Native',
        'Hispanic or Latino',
        'Jewish',
        'Asian',
        'Pacific Islander',
        'Indigenous Australian',
        'Other'], selected);
}

function mentalIllnessOptions(selected){

    return generateOptions([
    	'Schizophrenia',
        'Manic Depression',
        'Depression',
        'Anger Problems',
        'Anxiety',
        'Sociopathy'], selected);
}

function causeOfDeathOptions(selected){

    return generateOptions([
    	'Gunshot',
        'Assault',
        'Vehicle',
        '"Non Lethal" Weapon',
        'Unknown',
        'Other'], selected);
}

function dispositionOptions(selected){

    return generateOptions([
    	'Justified',
        'Homocide',
        'Other'], selected);
}

function countriesOptions(selected){

    return generateOptions([
    	'United States',
    	'Mexico'], selected);
}

module.exports = function(d, cb) {

    var viewParams = {};

    viewParams.success = d.success ? true : false;

    if(!viewParams.success){
        viewParams.missing = d.required ? setMissingTemplateVars(d.required) : null;
        viewParams.values = d.report ? formatValuesForForm(JSON.parse(d.report)) : formatValuesForForm({});
    }

    cb(null, viewParams);
}