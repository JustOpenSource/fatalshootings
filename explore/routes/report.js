var c = require(__base + '../shared-config/constants'),
    log = c.getLog('explore/routes/report');
var Import = require(__base + '../shared-utils/import');
var transform = require(__base + '../shared-utils/transform');

    //router
    router = require('express').Router(),
    
    renderView = require(__base + '../shared-utils/render-view');


function cleanPost(report) {
    var result = {
        death: {
            event: {}
        },
        subject: {},
        location: {}
    };

    // Maps the form values (flat object) to the db values (nested objects)
    // Todo(Joshua): This could probably be defined elsewhere (e.g., constants or schema)
    var mappings = {
        reporter_name                   : 'submitted_by.name',
        reporter_email                  : 'submitted_by.email',
        deceased_firstName              : 'subject.name',
        deceased_middleName             : 'subject.name',
        deceased_lastName               : 'subject.name',
        deceased_suffix                 : '',
        deceased_age                    : 'subject.age',
        deceased_sex                    : 'subject.sex',
        deceased_race                   : 'subject.race',
        deceased_raceOther              : 'subject.race',
        deceased_mentalIllness          : 'subject.mental_illness',
        circumstances_date              : 'death.event.date',
        circumstances_addr1             : 'death.event.address',
        circumstances_addr2             : 'death.event.address',
        circumstances_country           : 'location.country',
        circumstances_city              : 'location.city',
        circumstances_state             : 'location.state',
        circumstances_zip               : 'location.zipcode',
        circumstances_cause             : 'death.cause',
        circumstances_causeOther        : 'death.cause',
        circumstances_disposition       : 'death.disposition',
        circumstances_dispositionOther  : 'death.disposition',
        officer_firstName               : 'death.responsible_officer',
        officer_middleName              : 'death.responsible_officer',
        officer_lastName                : 'death.responsible_officer',
        officer_agency                  : 'death.responsible_agency',
        source_url                      : 'death.source_url'
    };

    //// For each transformation, get the reported value and insert it
    //// into the appropriate path in the db/result object
    //for (var key in mappings) {
    //
    //    // Transformations without a destination will be dropped
    //    if (report[key] && mappings[key]) {
    //
    //        // Walk through the formatted object, building the
    //        // nested object structure as necessary
    //        var path = mappings[key].split('.');
    //        var ref = result;
    //        for (var i = 0; i < path.length - 1; i++) {
    //            ref[path[i]] = ref[path[i]] || {};
    //            ref = ref[path[i]];
    //        }
    //
    //        // If there's already a saved value, concatenate with space
    //        if (ref[path[path.length-1]]) {
    //            ref[path[path.length-1]] += ' ' + report[key];
    //
    //        // Otherwise, store the reported value
    //        } else {
    //            ref[path[path.length - 1]] = report[key];
    //        }
    //    }
    //}

    return transform(report, mappings);
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

    var report = cleanPost(req.body);

    Import.singleImport(req._db.fatalities, report)
        .then(onSuccessRedirect)
        .catch(handleError);

    function onSuccessRedirect() {
        res.redirect('/');
    }

    function handleError(err) {
        console.log(err.stack || err);
        res.redirect('/');
    }

});

module.exports = router;