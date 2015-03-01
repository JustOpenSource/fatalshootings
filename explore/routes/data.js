var c = require(__base + '../shared-config/constants'),
    log = c.getLog('explore/routes/data'),

    q = require('q');

//npm libraries
express = require('express'),

    //application imports
    router = express.Router(),
    renderView = require(__base + '../shared-utils/render-view');


// url/data/
router.route('/')
    .get(function(req, res){

        var data = {};

        data.filter = validateFilters({

            'name' : req.query.name,
            'cause' : req.query.cause,
            'age' : req.query.age,
            'race' : req.query.race,
            'sex' : req.query.sex,
            'country' : req.query.country,
            'state' : req.query.state,
            'zip' : req.query.zip,
            'date_from' : req.query.date_from,
            'date_to' : req.query.date_to
        });

        data.collection = req._db.fatalities;

        getCount(data)
        .then(getResults)
        .then(function(body){

            //log('trace', 'data response success', body);
            res.json(body);
        })
        .fail(function(err) {

            log('error', 'could not get results', err);
            //throw error header
        });
    });

function validateFilters(d){

    //TODO: validate this data
    return {
        'name' : d.name,
        'cause' : d.cause,
        'age' : d.age,
        'race' : d.race,
        'sex' : d.sex,
        'country' : d.country,
        'state' : d.state,
        'zip' : d.zip,
        'date_from' : d.date_from,
        'date_to' : d.date_to
    }
}

function querySelect() {

    return {

        "value.subject.name" : true,
        "value.subject.age" : true,
        "value.subject.race" : true,
        "value.subject.sex" : true,
        "value.death.cause" : true,
        "value.death.event.date" : true,
        "value.location.state" : true
    }
}

function querySort() {

    return {
        "value.subject.age" : 1
    }
}

function queryFilter(filter) {

    log('trace', 'filter query params', filter);

    var queryFilters = {};

    if(filter.name){
        queryFilters['value.subject.name'] = filter.name;
    }

    if(filter.cause){
        queryFilters['value.death.cause'] = filter.cause;
    }

    if(filter.race){
        //TODO: Get rid of space in front of race
        queryFilters['value.subject.race'] = ' ' + filter.race;
    }

    if(filter.sex) {
        queryFilters['value.subject.sex'] = filter.sex;
    }

    if(filter.state) {
        queryFilters['value.location.state'] = filter.state;
    }

    /*
     AGE MUST BE CONVERTED TO INT
     if(filter.age) {
     var splitAge = filter.age.split('_');

     queryFilters['value.subject.age'] = {
     'gte' : splitAge[0],
     'lte' : splitAge[1]
     };
     }
     */

    /*
     DATE MUST BE CONVERTED TO YYYYMMDD Int
     if(filter.date) {
     queryFilters['value.subject.age'] = {
     $gte : filter.date_from,
     $lt : filter.date_to
     }
     }
     */

    return queryFilters;

}

function getCount(data) {

    log('trace', 'attempt to get count');

    var deferred = q.defer();

    data.collection.find(queryFilter(data.filter), querySelect())
        .count(function(err, count){

            if(err){

                log('error', 'could not get count', err);
                deferred.reject(err);
            }

            log('trace', 'getCount resolved: ' + count);

            data.count = count;

            deferred.resolve(data);

        });

    return deferred.promise;
}

function getResults(data){
    //log('trace', 'attempt to get results data', data);

    var deferred = q.defer();

    if(!data.skip || !data.limit){
        data.skip = null;
        data.limit = null;
    }

    data.collection.find(queryFilter(data.filter), querySelect())
    .sort(querySort())
    .skip(data.skip || null).limit(data.limit || null)
    .toArray(function(err, body){


        if(err){

            log('error', 'could not get results', err);

            deferred.reject(err);
        }

        log('trace', 'getResults resolved');

        deferred.resolve({

            body: body,
            count: data.count
        });
    });

    return deferred.promise;
}

module.exports = router;