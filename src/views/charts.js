module.exports = function(d, cb) {

    let filter = {};

    d.renderView('fatality-list-filter', {

        //_user: d._user,
        url_current: d.locals.url_current,
        url_distinct: d.locals.url_distinct,
        filters: filter,
        charts: true
    
    }, function(err, data) {

        if(err){

            cb(err);

            log('error', 'could not get query filter options', err);
        }

        cb(null, { filterView: data} );
    });
}