var __base = __base || '../';
var c = require(__base + 'constants');
var log = require(__base + 'utils/log')('utils/query-filters');

var DEFAULT_LIMIT = 10;

//TODO: actually validate the filters
function validateFilters(d){

    log('trace', 'validateFilters');

    //page
    d.page = parseInt(d.page) || 1;

    //limit
    if(d.limit === 'false'){

        d.limit = null;
        d.skip = null;

    } else {

        d.limit = parseInt(d.limit) || DEFAULT_LIMIT;
        d.skip = (d.page - 1) * d.limit;
    }

    //state
    if(d.state){
        d.state = d.state.toUpperCase();
    }

    //TODO: validate this data
    return {
        'name' : d.name,
        'state' : d.state,
        'zip' : d.zip,
        'year' : d.year,
        'month' : d.month,
        'cause' : d.cause,
        'age' : d.age,
        'race' : d.race,
        'sex' : d.sex,
        'country' : d.country,
        'state' : d.state,
        'zip' : d.zip,
        'date_from' : d.date_from,
        'date_to' : d.date_to,
        'age_from' : d.age_from,
        'age_to' : d.age_to,
        'page' : d.page,
        'record_state' : d.record_state,
        'assignee' : d.assignee,
        'limit' : d.limit,
        'skip' : d.skip
    }
}

function buildFilterURL(rootURL, filter, exclude){

    var params = '';

    exclude = exclude || {};

    //turn this into a loop
    if(filter.name && exclude.name !== false){
        params += '&name=' + filter.name;
    }

    if(filter.year && exclude.year !== false){
        params += '&year=' + filter.year;
    }

    if(filter.month && exclude.month !== false){
        params += '&month=' + filter.month;
    }

    if(filter.state && exclude.state !== false){
        params += '&state=' + filter.state;
    }

    if(filter.zip && exclude.zip !== false){
        params += '&zip=' + filter.zip;
    }

    if(filter.cause && exclude.cause !== false){
        params += '&cause=' + filter.cause;
    }

    if(filter.age_from && exclude.age_from !== false){
        params += '&age_from=' + filter.age_from;
    }

    if(filter.age_to && exclude.age_to !== false){
        params += '&age_to=' + filter.age_to;
    }

    if(filter.race && exclude.race !== false){
        params += '&race=' + filter.race;
    }

    if(filter.sex && exclude.sex !== false){
        params += '&sex=' + filter.sex;
    }

    if(!isNaN(filter.limit) && exclude.limit !== false) {
        params += '&limit=' + filter.limit;
    }

    if(!isNaN(filter.page) && exclude.page !== false) {
        params += '&page=' + filter.page;
    }

    if(filter.record_state && filter.record_state !== false){
        params += '&record_state=' + filter.record_state;
    }

    if(filter.assignee && filter.assignee !== false){
        params += '&assignee=' + filter.assignee;
    }

    if(params){
        params +=  '&'
    }

    return rootURL + '?' + params;
}

//wrapping in anon functions so that they retain access to local log()
module.exports = {

    validateFilters: function(d) {
        return validateFilters(d);
    },

    buildFilterURL: function(rootURL, filters, exclude) {
        return buildFilterURL(rootURL, filters, exclude);
    }
}