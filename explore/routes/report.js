var c = require(__base + '../shared-config/constants'),
    log = c.getLog('explore/routes/report'),

    _ = require('underscore'),
    
    //router
    router = require('express').Router(),
    
    renderView = require(__base + '../shared-utils/render-view'),
    validate = require(__base + '../shared-utils/schema-validator');


var MISSING_CLASS = 'fe-report-required-missing';

/*
TODO: 1. Build a handler to auto generate the form from the schema.
TODO: 2. Use a namespace on the generated form elements so that 
*/

/*
reporter_name
reporter_email
deceased_name
deceased_age
deceased_sex 
deceased_race 
deceased_raceOther
deceased_mentalIllness
circumstances_date
circumstances_address_1
circumstances_address_2
circumstances_country
circumstances_state
circumstances_city
circumstances_zip
circumstances_cause
circumstances_causeOther
circumstances_disposition
circumstances_dispositionOther
circumstances_notes
officer_firstName
officer_middleName
officer_lastName
officer_agency
source_url
*/

function formatEntry(entry){

    var country = {};

    if(entry.circumstances_country){
        country[entry.circumstances_country] = {
            "address_1": entry.circumstances_addr1,
            "address_1": entry.circumstances_addr2,
            "city": entry.circumstances_city,
            "city": entry.circumstances_city,
            "state": entry.circumstances_state,
            "zipcode": entry.circumstances_zip
        }
    }
    
    var formattedEntry = {
        "submitted_by_name" : entry.reporter_name,
        "submitted_by_email" : entry.reporter_email,
        "published" : false,

        "subject" : {
            "sex": entry.deceased_sex,
            "orientation": entry.deceased_orientation,
            "cisgendered" : entry.deceased_cis,
            "name" : entry.deceased_name,
            "race" : entry.deceased_race,
            "race_other" : entry.deceased_race_other,
            "mental_illness" : entry.deceased_mental_illness,
            "mental_illness_other" : entry.deceased_mental_illness_other
        },

        "death" : {
            "cause" : entry.circumstances_cause,
            "cause_notes" : entry.circumstances_causeOther,
            "responsible_agency" : entry.officer_agency,
            "description" : entry.circumstances_notes,
            "disposition" : entry.circumstances_disposition,
            "disposition_other" : entry.circumstances_dispositionOther,
            "disposition_notes" : entry.circumstances_notes,
        },

        "location" : {
            "coordinates" : {
                "latitude" : null,
                "longitude" : null
            },

            "country" : country
        },

        "officer" : {
            "name" : entry.officer_name,
            "agency" : entry.officer_agency
        },

        "source" : entry.source_url
    }

    //only add these if they exist
    if(entry.deceased_age !== "unknown") {
        formattedEntry.subject.age = parseInt(entry.deceased_age);
    }

    if(entry.circumstances_date !== ""){
        formattedEntry.death.date = entry.circumstances_date;
    }

    return formattedEntry;
}

function formatFormValues(report, formValues) {

    report.location.address_1 = formValues.circumstances_addr1;
    report.location.address_2 = formValues.circumstances_addr2;
    report.location.country = formValues.circumstances_country;
    report.location.state = formValues.circumstances_state;
    report.location.city = formValues.circumstances_city;
    report.location.zip = formValues.circumstances_zip;

    return report;
}

function testForRequiredValues(report){
    var required = [];

    if(!report.subject.name){
        required.push('deceased_name');
    }

    if(!report.subject.sex){
        required.push('deceased_sex');
    }

    if(!report.location.country){
        required.push('circumstances_country');
    }

    if(!report.location.state){
        required.push('circumstances_state');
    }

    if(!report.death.date){
        required.push('circumstances_date');
    }

    if(!report.source){
        required.push('source_url');
    }

    return required;
}

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

function formatValues(report){

    if(!report.subject){
        report.subject = {}
        report.death = {};
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

    return generateOptions(['male', 'female', 'intersex'], selected);
}

function orientationOptions(selected){

    return generateOptions(['heterosexual', 'homosexual', 'bisexual', 'other'], selected);
}

function cisgenderedOptions(selected){

    return generateOptions(['cisgender', 'transgender'], selected);
}

function raceOptions(selected){

    return generateOptions(['White / European', 
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

    return generateOptions(['Schizophrenia',
        'Manic Depression',
        'Depression',
        'Anger Problems',
        'Anxiety',
        'Sociopathy'], selected);
}

function causeOfDeathOptions(selected){

    return generateOptions(['Gunshot',
        'Assault',
        'Vehicle',
        '"Non Lethal" Weapon',
        'Unknown',
        'Other'], selected);
}

function dispositionOptions(selected){

    return generateOptions(['Justified',
        'Homocide',
        'Other'], selected);
}

function countriesOptions(selected){

    return generateOptions(['United States','Mexico'], selected);
}

// url/report/
router.route('/')
.get(function(req, res){

    var page_title = 'Report A Death';
    
    var viewParams = {};

    viewParams.success = req.query.success ? true : false;

    if(!viewParams.success){
        viewParams.missing = req.query.required ? setMissingTemplateVars(req.query.required) : null;
        viewParams.values = req.query.report ? formatValues(JSON.parse(req.query.report)) : formatValues({});
    }

    renderView(req, res, 'report', viewParams, {

    	//page params
        title: page_title,
        css: ['reportADeathForm']
    });
})

.post(function(req, res){

    var report = formatEntry(req.body);
    var formValues = formatFormValues(report, req.body);
    var required = testForRequiredValues(report);
    var missing = required.length > 0 ? true : false;

    //FOR TESTING
    //required = ['test'];

    if(missing){

        res.redirect('/report?missing=true&required=' + required.join(',') + '&report=' + JSON.stringify(formValues));

    } else {

        try {

            report = {
                'value' : JSON.parse(JSON.stringify(report))
            }
        
        } catch(e){
        
            res.redirect('/report?error=true');
        
        }
        
        report.pending = true;

        req._db.fatalities.insert(report, function(err, body){

            if(err){
                res.redirect('/report?error=true');
            } else {
                res.redirect('/report?success=true');
            }

            

            log('trace', 'new entry added');
        });
    }
});

module.exports = router;