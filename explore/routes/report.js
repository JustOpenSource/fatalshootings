var c = require(__base + '../shared-config/constants'),
    log = c.getLog('explore/routes/report');
    
    //router
    router = require('express').Router(),
    
    renderView = require(__base + '../shared-utils/render-view'),
    validate = require(__base + '../shared-utils/schema-validator');


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
circumstances_city
circumstances_state
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

    function stringToBool(bool){
        return bool.toLowerCase() == 'true' ? true : false;
    }

    function formatDate(date){
        data = date.split('/');

        return parseInt(date[2] + date[1] + date[0]);
    }
    
    var formattedEntry = {
        "submitted_by" : entry.reporter_name,
        "published" : false,
        "subject" : {
            "sex": entry.deceased_sex,
            "cis" : stringToBool(entry.deceased_cis),
            "name" : entry.deceased_name,
            "race" : entry.deceased_race,
            "mental_illness" : entry.deceased_mentalIllness
        },

        "death" : {

            "cause" : entry.circumstances_cause,
            "cause_notes" : entry.circumstances_causeOther,
            "responsible_agency" : entry.officer_agency,
            "description" : entry.circumstances_notes,
            "disposition" : entry.circumstances_disposition,
            "disposition_notes" : entry.circumstances_dispositionOther,
            "source_url" : entry.source_url
        },

        "encounter" : {

            "location" : {

                "coordinates" : {
                    "latitude" : null,
                    "longitude" : null
                },

                "country" : {

                    "USA": {

                        "city": entry.circumstances_city,

                        "state": entry.circumstances_state,

                        "zipcode": entry.circumstances_zip
                    }
                }
            }
        }
    }

    //only add these if they exist
    if(entry.deceased_age !== "unknown") {
        formattedEntry.subject.aga = parseInt(entry.deceased_age);
    }

    if(entry.circumstances_date !== ""){
        formattedEntry.encounter.date = formatDate(entry.circumstances_date);
    }

    return formattedEntry;
}

// url/list/
router.route('/')
.get(function(req, res){

    var page_title = 'Report A Death';

    renderView(req, res, 'report', {
    	//report params
    }, {
    	//page params
        title: page_title,
        css: ['reportADeathForm']
    });
})

.post(function(req, res){

    log('trace', 'post data', req.body);

    var report = formatEntry(req.body);

    log('trace', report);

    var validatedReport = validate(report);

    log('trace', validatedReport);

    res.redirect('/report');

    /*
    report.pending = true;

    req._db.fatalities.insert(req.body, function(err, body){

        log('trace', 'new entry added');
    });
    */
});

module.exports = router;