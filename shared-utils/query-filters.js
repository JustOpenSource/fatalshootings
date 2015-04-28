var __base = __base || '../',
    c = require(__base + 'shared-config/constants'),
    log = c.getLog('shared-utils/query-filters'),

    //constants
    DEFAULT_LIMIT = 10;

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

    if(filter.pending) {
        queryFilters['pending'] = 'true';
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

function validateFilters(d){

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
        'cause' : d.cause,
        'age' : d.age,
        'race' : d.race,
        'sex' : d.sex,
        'country' : d.country,
        'state' : d.state,
        'zip' : d.zip,
        'date_from' : d.date_from,
        'date_to' : d.date_to,
        'page' : d.page,
        'limit' : d.limit,
        'skip' : d.skip,
        'pending' : d.pending || false
    }
}

function buildFilterURL(rootURL, filter, exclude){

    var params = '';

    exclude = exclude || {};

    //turn this into a loop
    if(filter.name && exclude.name !== false){
        params += 'name=' + filter.name;
    }

    if(filter.cause && exclude.cause !== false){
        params += '&cause=' + filter.cause;
    }

    if(filter.race && exclude.race !== false){
        params += '&race=' + filter.race;
    }

    if(filter.sex && exclude.sex !== false){
        params += '&sex=' + filter.sex;
    }

    if(filter.state && exclude.state !== false) {
        params += '&state=' + filter.state;
    }

    if(!isNaN(filter.limit) && exclude.limit !== false) {
        params += '&limit=' + filter.limit;
    }

    if(!isNaN(filter.page) && exclude.page !== false) {
        params += '&page=' + filter.page;
    }

    if(filter.pending && exclude.pending !== false){
        params += '&pending=' + filter.pending;
    }

    if(params){
        params +=  '&'
    }

    return rootURL + '?' + params;
}

//wrapping in anon functions so that they retain access to local log()
module.exports = {

    querySelect: function() {
        return querySelect();
    },

    querySort: function() {
        return querySort();
    },

    queryFilter: function(filter) {
        return queryFilter(filter);
    },

    validateFilters: function(d) {
        return validateFilters(d);
    },

    buildFilterURL: function(rootURL, filters, exclude) {
        return buildFilterURL(rootURL, filters, exclude);
    }
}