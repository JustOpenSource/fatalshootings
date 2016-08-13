var __base = __base || '../';
var c = require(__base + 'constants');
var log = require(__base + 'utils/log')('routes/details');
var _ = require('underscore');
var router = require('express').Router();
var renderView = require(__base + 'utils/render-view');

// url/details/
router.route('/:id')
.get(function(req, res){

    res.json({'status' : 'disabled'});

    /*

    handleStateAndAssignmentChanges(req, res);

    var page_title = 'Details';

    renderView(req, res, 'details', {
  
        "id" : req.params.id,
        "edit" : req.query.edit,
        "missing" : req.query.missing,
        "success" : req.query.success,
        "missing_values" : req.query.missing_values,
        "details" : req.query.details ? JSON.parse(req.query.details) : null

    }, {

        title: page_title,
        css: ['details']
    });

    */
})

.post(function(req, res){

    var report = formatEntryForDatabase(req.body);
    var required = testForRequiredValues(report);

    if(required.length > 0){

        res.redirect('/details/new?missing=true&missing_values=' + required.join(',') + '&details=' + JSON.stringify(report));

    } else {

        //TODO: adjust to edit current entry

        req._db.fatalities.insert({
            'value' : report
        }, function(err, body){

            if(err){
                
                res.redirect('/details/new?error=true');
            
            } else {

                log('trace', 'new entry added');

                res.redirect('/details/new?success=true');
            }
        });
    }
});

function handleStateAndAssignmentChanges(req, res){

    log('find', 'handleStateAndAssignmentChanges');

    if(req.query.removeAssignment === 'true'){

        /*
        req._db.fatalities.update({}, {

            $set : {"assignee" : ""}
        
        }, {

            upsert:false,
            multi:true
        
        }); 
        */

        res.redirect('/details/' + req.params.id + '?removeAssignment=complete');
    }

    if(req.query.addAssignment === 'true'){
        
        /*    
        req._db.fatalities.update({}, {

            $set : {"assignee" : "test"}
        
        }, {

            upsert:false,
            multi:true
        
        }); 
        */

        res.redirect('/details/' + req.params.id + '?addAssignment=complete');
    }
}

function formatEntryForDatabase(entry){

    var formattedEntry = {
        "submitted_by_name" : entry.reporter_name,
        "submitted_by_email" : entry.reporter_email,
        "published" : false,

        "subject" : {
            "sex": entry.subject_sex,
            "orientation": entry.subject_orientation,
            "cisgendered" : entry.subject_cis,
            "name" : entry.subject_name,
            "race" : entry.subject_race,
            "race_other" : entry.subject_race_other,
            "mental_illness" : entry.subject_mental_illness,
            "mental_illness_other" : entry.subject_mental_illness_other
        },

        "death" : {
            "cause" : entry.death_cause,
            "cause_notes" : entry.death_causeOther,
            "responsible_agency" : entry.officer_agency,
            "description" : entry.death_notes,
            "disposition" : entry.death_disposition,
            "disposition_other" : entry.death_dispositionOther,
            "disposition_notes" : entry.death_notes,
        },

        "location" : {
            "coordinates" : {
                "latitude" : null,
                "longitude" : null
            },

            "country" : entry.location_country,
            "address_1": entry.location_address_line_1,
            "address_2": entry.location_address_line_2,
            "city": entry.location_city,
            "state": entry.location_state,
            "zipcode": entry.location_zip
        },

        "sources" : entry.sources
    }

    //only add these if they exist
    if(entry.subject_age !== "unknown") {
        formattedEntry.subject.age = parseInt(entry.subject_age);
    }

    if(entry.death_date !== ""){
        formattedEntry.death.date = entry.death_date;
    }

    return formattedEntry;
}

function testForRequiredValues(report){
    var missing = [];

    var requiredValues = [
        [report.subject.name, 'subject_name'],
        [report.location.country, 'location_country'],
        [report.location.state, 'location_state'],
        [report.death.date, 'death_date'],
        [report.sources, 'sources']
    ];

    _.each(requiredValues, function(value){
        if(!value[0]){
            missing.push(value[1]);
        }
    });

    return missing;
}

module.exports = router;