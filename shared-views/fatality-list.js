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
        limit = parseInt(d.limit) || DEFAULT_LIMIT,
        page = parseInt(d.page) || 1,
        skip = (page - 1) * limit;

    function queryFilter() {
        
        return {};
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
            
            filters: getView('fatality-list-filter', queryFilter()).html,

            pagination: getView('components/pagination', {
                count: data.count,
                current: page,
                limit: limit
            }).html
        });
    }      

    getCount()
    .then(getResults)
    .then(returnData)
    .fail(function(err) {

        log('error', 'could not get fatality list view', err);
        cb(err);

    });
}