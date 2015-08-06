var c = require(__base + '../shared-config/constants'),
    log = c.getLog('explore/routes/report'),

    _ = require('underscore'),
    
    //router
    router = require('express').Router(),
    
    renderView = require(__base + '../shared-utils/render-view'),
    validate = require(__base + '../shared-utils/schema-validator');


/*
TODO: 1. Build a handler to auto generate the form from the schema.
TODO: 2. Build a data service to accept a record and return validation information
*/

function formatEntryForDatabase(entry){

    var country = {};

    if(entry.circumstances_country){
        country[entry.circumstances_country] = {
            "address_1": entry.circumstances_addr1,
            "address_2": entry.circumstances_addr2,
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

function formatFormValuesForQueryParams(report, formValues) {

    report.location.address_1 = formValues.circumstances_addr1;
    report.location.address_2 = formValues.circumstances_addr2;
    report.location.country = formValues.circumstances_country;
    report.location.state = formValues.circumstances_state;
    report.location.city = formValues.circumstances_city;
    report.location.zip = formValues.circumstances_zip;

    return report;
}

function testForRequiredValues(report){
    var missing = [];

    var requiredValues = [
        [report.subject.name, 'deceased_name'],
        [report.subject.sex, 'deceased_sex'],
        [report.location.country, 'circumstances_country'],
        [report.location.state, 'circumstances_state'],
        [report.death.date, 'circumstances_date'],
        [report.source, 'source_url']
    ];

    _.each(requiredValues, function(value){
        if(!value[0]){
            missing.push(value[1]);
        }
    });

    return missing;
}

// url/report/
router.route('/')
.get(function(req, res){

    var page_title = 'Report A Death';

    renderView(req, res, 'report', {

        success: req.query.success,
        missing: req.query.missing,
        report: req.query.report,
        required: req.query.required
    
    }, {

    	//page params
        title: page_title,
        css: ['reportADeathForm']
    });
})

.post(function(req, res){

    var report = formatEntryForDatabase(req.body);
    var formValues = formatFormValuesForQueryParams(report, req.body);
    var required = testForRequiredValues(report);
    var missing = required.length > 0 ? true : false;

    if(missing){

        res.redirect('/report?missing=true&required=' + required.join(',') + '&report=' + JSON.stringify(formValues));

    } else {

        report = {
            'value' : report
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