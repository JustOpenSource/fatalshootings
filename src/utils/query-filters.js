var __base = __base || '../';
var c = require(__base + 'constants');
var log = require(__base + 'utils/log')('utils/query-filters');

var DEFAULT_LIMIT = 10;

//TODO: The details of the filters should be generated from the CONF.js file, under 'list'
function querySelect() {

    return {
        "id" : true,
        "value.subject.name" : true,
        "value.subject.age" : true,
        "value.subject.race" : true,
        "value.subject.sex" : true,
        "value.death.cause" : true,
        "value.death.event.date" : true,
        "value.location.state" : true,
        "assignee" : true
    }
}

function querySort() {

    //TODO: change this to date once date is normalized
    return {
        "value.subject.age" : 1
    }
}

function queryFilter(filter, username) {

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
        queryFilters['value.location.state'] = 'new';
    }

    if(filter.recordState) {
        queryFilters['recordState'] = filter.recordState;
    }

    if(username && filter.assigned === 'me') {
        queryFilters['assignee'] = username;
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
        'recordState' : d.recordState || false,
        'limit' : d.limit,
        'skip' : d.skip
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

    if(filter.recordState && filter.recordState !== false){
        params += '&recordState=' + filter.recordState;
    }

    if(filter.assigned && filter.assigned !== false){
        params += '&assigned=' + filter.assigned;
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