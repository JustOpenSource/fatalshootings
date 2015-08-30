var __base = __base || '../',
    c = require(__base + 'shared-config/constants'),
    log = c.getLog('shared-views/fatality-list'),
    httpGet = require(__base + 'shared-utils/http-get'),

    //node require
    q = require('q'),

    //app require
    getView = require(__base + 'shared-utils/get-view'),
    filterUtils = require(__base + 'shared-utils/query-filters');

module.exports = function(d, cb) {

    var collection = d._db.fatalities,
        filter = filterUtils.validateFilters(d.filters);

    filter.pending = d.pending ? true : false;

    function getQueryFilterOptions() {

        log('trace', 'attempt to get query filter options');

        var deferred = q.defer();

        getView(d._str._lang, 'fatality-list-filter', {

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

        cb(null, {

            results: data.body,
            count: data.count,
            admin: d.admin,
            pending: d.pending,
            filters: data.filterView.html,

            pagination: getView(d._str._lang, 'components/pagination', {

                count: data.count,
                current: filter.page,
                limit: filter.limit,
                url: filterUtils.buildFilterURL('/list', filter, { page: false })
            
            }).html
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