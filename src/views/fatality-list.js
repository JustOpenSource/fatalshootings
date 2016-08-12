__base = __base || '../';

var c = require(__base + 'constants');
var log = require(__base + 'utils/log')('views/fatality-list');
var httpGet = require(__base + 'utils/http-get');
var q = require('q');
var filterUtils = require(__base + 'utils/query-filters');
var _ = require('underscore');

function main(d, cb) {

    var filter = filterUtils.validateFilters(d.filters);

    function getQueryFilterOptions() {

        var deferred = q.defer();

        d.renderView('fatality-list-filter', {

            _user: d._user,
            url_current: d.locals.url_current,
            url_distinct: d.locals.url_distinct,
            filters: filter
        
        }, function(err, data) {

            if(err){

                log('error', 'could not get query filter options', err);
                
                deferred.reject(err);
            }

            deferred.resolve({
                filterView: data
            });
        });

        return deferred.promise;
    }

    //get result entries for current page
    function getResults(data) {

        var deferred = q.defer();

        //TODO: Handle data api connection error and what that does to this view
        httpGet(filterUtils.buildFilterURL(d.locals.url_data, filter), function(err, body){

            if(err){
                log('error', 'get results', err);

                cb(null, {

                    httpGetError: true,
                    filters: data.filterView
                });

                return;
            }

            if(body.count < 1){

                cb(null, {

                    noResults: true,
                    filters: data.filterView
                });

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

    //TODO: Handle no results case
    function returnData(data) {

        var pagination;
        var filterUrl = filterUtils.buildFilterURL('/list', filter, { page: false });
        var pagination = d.renderView('components/pagination', {

            count: data.count,
            current: filter.page,
            limit: filter.limit,
            url: filterUrl
        
        });

        _.each(data.body, function(entry, i){

            /*
            log('trace', 'current entry', entry);
            log('trace', 'current user', d._user);
            log('trace', 'current username', d._user.username);
            log('trace', 'current assignee', entry.assignee);
            */

            if( d._user && d._user.username === entry.assignee ){
                
                data.body[i].assigned =  {
                    'state': 'me',
                    'title': 'Assigned to me'
                }

            } else if( entry.assignee ){
                
                data.body[i].assigned = {
                    'state': 'other',
                    'title': 'Assigned to someone else'
                }
            
            } else {
                
                data.body[i].assigned = {
                    'state': 'nobody',
                    'title': 'Not assigned'
                }
            }

            
        });

        //log('trace', 'current entry', data.body);

        cb(null, {

            user: d._user,
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
    .catch(function(err) {

        log('error', 'could not get fatality list view', err);
        cb(err);

    });
}

module.exports = main;