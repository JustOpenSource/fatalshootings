var __base = __base || '../',
    c = require(__base + 'shared-config/constants'),
    log = c.getLog('shared-views/fatality-list'),

    q = require('q'),

    getView = require(__base + 'shared-utils/get-view'),

    DEFAULT_LIMIT = 10;

module.exports = function(d, cb) {

    var collection = d._db.fatalities,
        limit = parseInt(d.limit) || DEFAULT_LIMIT,
        page = parseInt(d.page) || 1,
        skip = (page - 1) * limit;

    function queryFilter(){
        
        return {};
    }

    function querySelect(){
        
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

    function querySort(){
        
        return { 
            "value.death.event.date" : -1
        }
    }

    function getCount() {

        log('trace', 'calling getCount()');

        var deferred = q.defer();

        collection.find(queryFilter(), querySelect())
        .count(function(err, count){

            if(err){
                log('error', 'could not get count', err);
                deferred.reject(new Error(err));
            }

            log('trace', 'getCount resolved: ' + count);

            deferred.resolve(count);

        });

        return deferred.promise;
    }

    //get result entries for current page
    function getResults(count){

        var deferred = q.defer();

        page = page * limit > count ? Math.ceil(count / limit) : page;

        collection.find(queryFilter(), querySelect())
        .sort(querySort())
        .skip(skip).limit(limit)
        .toArray(function(err, body){
            if(err){

                log('error', 'could not get results', err);

                cb(err);

                close();

                return;
            }

            deferred.resolve({
                err: err, 
                body: body, 
                count: count
            });
        });

        return deferred.promise;
    }

    function returnData(data){

        log('trace', 'got results, calling cb() and passing in model data');

        return {

            results: data.body,
            count: data.count,
            
            filters: getView('fatality-list-filter', queryFilter()).html,

            pagination: getView('components/pagination', {
                count: data.count,
                current: page,
                limit: limit
            }).html
        };
    }      

    getCount().then(function(count){

        return getResults(count);

    }).then(function(data){

        cb(null, returnData(data));
    
    }).fail(function(err){

        log('error', err);
        cb(err);

    });

}