__base = __base || '../';

var c = require(__base + 'constants');
var log = require(__base + 'utils/log')('views/fatality-list');
var httpGet = require(__base + 'utils/http-get');
var q = require('q');
var filterUtils = require(__base + 'utils/query-filters');

module.exports = function(d, cb) {

    var collection = d._db.fatalities;
    var filter = filterUtils.validateFilters(d.filters);

    filter.pending = d.pending ? true : false;

    function getQueryFilterOptions() {

        log('trace', 'attempt to get query filter options');

        var deferred = q.defer();

        d.renderView('fatality-list-filter', {

            url_current: d.locals.url_current,
            url_distinct: d.locals.url_distinct,
            collection: collection,
            filters: filter
        
        }, function(err, data) {

            if(err){

                log('error', 'could not get query filter options', err);
                
                deferred.reject(err);
            }

            log('trace', 'got query filter options');

            deferred.resolve({
                filterView: data
            });
        });

        return deferred.promise;
    }

    //get result entries for current page
    function getResults(data) {

        log('trace', 'attempt to get results');

        var deferred = q.defer();

        httpGet(filterUtils.buildFilterURL(d.locals.url_data, filter), function(err, body){

            if(err){

                log('error', 'get results', err);
                return;
            }

            log('trace', 'got results');

            deferred.resolve({

                body: body.body,
                count: body.count,
                filterView: data.filterView
            });
        })

        return deferred.promise;
    }

    function returnData(data) {

        log('trace', 'return results');

        var pagination;

        log('trace', 'build filterUrl');

        var filterUrl = filterUtils.buildFilterURL('/list', filter, { page: false });

        log('trace', 'build pagination');
        
        var pagination = d.renderView('components/pagination', {

            count: data.count,
            current: filter.page,
            limit: filter.limit,
            url: filterUrl
        
        });

        log('trace', 'build pagination success');

        cb(null, {

            results: data.body,
            count: data.count,
            admin: d.admin,
            pending: d.pending,
            filters: data.filterView,
            pagination: pagination

        });
    }

    //first two calls can happen at the same time
    getQueryFilterOptions()
    .then(getResults)
    .then(returnData)
    .fail(function(err) {

        log('error', 'could not get fatality list view', err);
        cb(err);

    });
}