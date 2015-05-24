var __base = __base || '../';
var c = require(__base + 'shared-config/constants');
var log = c.getLog('shared-views/fatality-list');
var q = require('q');

var httpGet = q.nfbind(require(__base + 'shared-utils/http-get'));
    //node require

    //app require
var getView = require(__base + 'shared-utils/get-view');
var filterUtils = require(__base + 'shared-utils/query-filters');

module.exports = function(d, cb) {

    var collection = d._db.fatalities,
        filter = filterUtils.validateFilters(d.filters);

    filter.pending = d.pending ? true : false;

    function getQueryFilterOptions() {

        log('trace', 'attempt to get query filter options');

        var deferred = q.defer();

        var listFilterData = {
            collection: collection,
            filters: filter
        }

        console.log('$$$$$$$$$$$$$$$$');
        console.log(d._str._lang);

        getView(d._str._lang, 'fatality-list-filter', listFilterData, function(err, data) {

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

        return httpGet(filterUtils.buildFilterURL(c.url.data, filter)).then(function(body){

            log('trace', 'got results');

            return {
                body: body.body,
                count: body.count,
                filterView: data.filterView
            };
        }).catch(function(err) {
            log('error', 'get results', err);
        })

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