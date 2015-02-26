var __base = __base || '../',
    c = require(__base + 'shared-config/constants'),
    log = c.getLog('shared-views/fatality-list'),

    //node require
    q = require('q'),

    //app require
    getView = require(__base + 'shared-utils/get-view'),
    
    //constants
    DEFAULT_LIMIT = 10;

module.exports = function(d, cb) {

    var collection = d._db.fatalities,

        //pagination
        limit = parseInt(d.limit) || DEFAULT_LIMIT,
        page = parseInt(d.page) || 1,
        skip = (page - 1) * limit,
        filter = validateFilters(d.filters);

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

    function getQueryFilterOptions(count) {

        //TODO: Turn this into a cached dataset
        var deferred = q.defer();

        /*
        collection.find(queryFilter(), querySelect())
            .toArray(function(err, count){

                if(err){

                    log('error', 'could not get count', err);
                    deferred.reject(err);
                }

                log('trace', 'getCount resolved: ' + count);

                filterHTML = getView('fatality-list-filter', {
                    filters: queryFilter()
                }).html;

                deferred.resolve(count);

            });
        */

        deferred.resolve(count);

        return deferred.promise;
    }

    function queryFilter() {

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
            "value.death.event.date" : -1
        }
    }

    function getCount() {

        log('trace', 'attempt to get count');

        var deferred = q.defer();

        collection.find(queryFilter(), querySelect())
        .count(function(err, count){

            if(err){

                log('error', 'could not get count', err);
                deferred.reject(err);
            }

            log('trace', 'getCount resolved: ' + count);
            deferred.resolve(count);

        });

        return deferred.promise;
    }

    //get result entries for current page
    function getResults(count) {

        log('trace', 'attempt to get results');

        var deferred = q.defer();

        page = page * limit > count ? Math.ceil(count / limit) : page;

        collection.find(queryFilter(), querySelect())
        .sort(querySort())
        .skip(skip).limit(limit)
        .toArray(function(err, body){
            if(err){

                log('error', 'could not get results', err);
                deferred.reject(err);
            }

            log('trace', 'getResults resolved');
            deferred.resolve({
                err: err, 
                body: body, 
                count: count
            });
        });

        return deferred.promise;
    }

    function returnData(data) {

        log('trace', 'return results');

        cb(null, {

            results: data.body,
            count: data.count,
            
            //filters: getQueryFilters(),

            pagination: getView('components/pagination', {
                count: data.count,
                current: page,
                limit: limit
            }).html
        });
    }      

    getCount()
    .then(getQueryFilterOptions)
    .then(getResults)
    .then(returnData)
    .fail(function(err) {

        log('error', 'could not get fatality list view', err);
        cb(err);

    });
}