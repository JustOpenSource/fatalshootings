var __base = __base || '../';
var c = require(__base + 'constants');
var log = require(__base + 'utils/log')(__dirname);
var q = require('q');
var httpGet = require(__base + 'utils/http-get');
var filterUtils = require(__base + 'utils/query-filters');
var renderView = require(__base + 'utils/render-view');
var router = require('express').Router();
var renderView = require(__base + 'utils/render-view');
var getFilteredData = require(__base + 'utils/get-filtered-data');

function getResults(data){
    var deferred = q.defer();
    getFilteredData(data.filter, (err, response)=>{

            if(err){
                log('error', 'could not get results', err);
                deferred.reject(err);
            }

            response = JSON.parse(response);

            data.count = response.body.count;
            data.body = response.body.items;

            deferred.resolve(data);
        }
    );
    return deferred.promise;
}

/*

function getResults(data){
    var deferred = q.defer();

    dbInstance.getResults(data.filter, (err, response)=>{

            if(err){
                log('error', 'could not get results', err);
                deferred.reject(err);
            }

            data.count = response.count;
            data.body = response.items;

            deferred.resolve(data);
        }
    );
    
    return deferred.promise;
}
*/

/*
function getResult(data){
    var deferred = q.defer();

    dbInstance.getResult(data.id, (err, response)=>{

            if(err){
                log('error', 'could not get results', err);
                deferred.reject(err);
            }

            data.value = response.Responses['sdf-test1'][0].body;

            deferred.resolve(data);
        }
    );
    return deferred.promise;
}
*/

/*
ROOT API
*/
router.route('/api/:version/')
.get(function(req, res){

    var data = {
        'count' : 0
    };

    data._user = req.session && req.session.user ? req.session.user : null;
    data.filter = filterUtils.validateFilters(req.query);

    getResults(data)
        .then((body)=>{

            log('trace', '/data/api/v1 response');
            res.json(body);
        })
        .catch(function(err){

            log('error', 'could not get results', err);
            res.sendStatus(500);
        });


});

/*
router.route('/api/:version/details/:record_id')
.get(function(req, res){

    log('trace', '/data/api/v1/details req.params.record_id', req.params.record_id);

    var data = {
        'id' : req.params.record_id
    };

    getResult(data)
        .then((body)=>{

            log('trace', '/data/api/v1 response');
            res.json(body);
        })
        .catch(function(err){

            log('error', 'could not get results', err);
            res.sendStatus(500);
        });
});
*/

router.route('/')
.get(function(req, res){

    renderView(req, res, 'data-api', {

        url: {

            'details' : [
                '/data/api/v1/details/fatality_2798'
            ],

            'attr' : [
                '/data/api/v1?sex=female',
                '/data/api/v1?sex=female&limit=30',
                '/data/api/v1?race=European-American/White',
                '/data/api/v1/?cause=automobile',
                '/data/api/v1/?state=MD',
                '/data/api/v1/?state=MD&sex=male',
                '/data/api/v1/?limit=false'
            ],

            'pagination' : [
                '/data/api/v1/?sex=male&limit=5&page=2',
                '/data/api/v1/?sex=male&cause=gunshot&limit=5&page=2'
            ],

            'distinct' : [
                '/data/api/v1/distinct/race',
                '/data/api/v1/distinct/sex',
                '/data/api/v1/distinct/mental_illness',
                '/data/api/v1/distinct/cause',
                '/data/api/v1/distinct/disposition',
                '/data/api/v1/distinct/responsible_agency'
            ],

            'distinctCount' : [
                '/data/api/v1/distinct/race?count=true',
                '/data/api/v1/distinct/sex?count=true'
            ]
        }

    }, {

        title: 'Data API',
        js: ['main/data'],
        css: ['data']

    });
});

/*
router.route('/api/:version/')
.get(function(req, res){

    //DJANGO
    var data = {
        'count' : 0
    };

    var resultsURL = "http://fe-backend.herokuapp.com/api/subjects/?format=json"

    console.log(resultsURL);

    httpGet(resultsURL, function(err, body){
        console.log('error -----');
        console.log(err);
        console.log(body);

        res.status(200).json(data);
    });
    
    //OLD
    data._user = req.session && req.session.user ? req.session.user : null;
    data.filter = filterUtils.validateFilters(req.query);

    //HERE IS WHERE WE GET THE DATA
    data.collection = req._db.fatalities;

    getCount(data)
        .then(getResults)
        .then(function(body){

            log('trace', '/data/api/v1 response');
            res.json(body);
        })
        .fail(function(err){

            log('error', 'could not get results', err);
            res.sendStatus(500);
        });

      
});
*/

/*
function getCount(data) {

    log('trace', 'attempt to get count');

    var deferred = q.defer();

    data.collection.find(filterUtils.queryFilter(data.filter, data._user.username), filterUtils.querySelect())
        .count(function(err, count){

            if(err){

                log('error', 'could not get count', err);
                deferred.reject(err);
            }

            log('trace', 'got count: ' + count);

            data.count = count;

            deferred.resolve(data);

        });

    return deferred.promise;
}
*/


/*
function getResults(data){

    var deferred = q.defer();

    data.collection.find(filterUtils.queryFilter(data.filter, data._user.username), filterUtils.querySelect())
    .sort(filterUtils.querySort())
    .skip(data.filter.skip || 0).limit(data.filter.limit)
    .toArray(function(err, body){

        if(err){

            log('error', 'could not get results', err);

            deferred.reject(err);
        }

        log('trace', 'got results');

        deferred.resolve({

            body: body,
            count: data.count
        });
    });

    return deferred.promise;
}
*/

/*
function getDistinctCount(collection, mapper, cb){

    log('trace', 'get distinct count');

    var reducer = function (race, count) {

        return Array.sum(count);
    };

    collection.mapReduce(
        mapper,
        reducer,

        { out: { inline : true } },

        function(err, response) {

            cb(err, response);
        }
    );
}

function getDetails(data, id, cb){
    log('trace', 'attempt to get details');

    data.collection.findOne({
        
        id : id
    
    }, function(err, body){
        if(err){
            cb(err);
        }

        cb(null, body)
    });
}
*/

/*
// url/data/api
router.route('/api/:version/details/:record_id')
.get(function(req, res){

    log('trace', '/data/api/v1/details req.params.record_id', req.params.record_id);

    var data = {};

    data.collection = req._db.fatalities;

    getDetails(data, req.params.record_id, function(err, body){
        if(err){
            log('error', 'could not get details', err);

            res.sendStatus(500);
        }

        log('trace', '/data/api/v1/details response', body);

        res.status(200).json(body);
    });

});
*/

/*
router.route('/api/:version/distinct/:attr')
.get(function(req, res){

    var attr = req.params.attr,
        attribute,
        whitelist = {
            subject : ['race', 'sex', 'mental_illness'],
            death : ['cause', 'disposition', 'responsible_agency']
        };

    log('trace', 'request for /api/v1/distinct/' + attr);

    if(whitelist.subject.indexOf(attr) !== -1){

        attribute = "value.subject." + attr;

    } else if(whitelist.death.indexOf(attr) !== -1){

        attribute = "value.death." + attr

    } else {

        res.status(404).send('"' + attr + '" is not a supported attribute');
    }

    if(req.query.count){

        var mapper;

        //build mapper for each attribute
        if(attr === 'race'){

            mapper = function(){
                emit(this.value.subject.race, 1);
            }

        } else if(attr === 'sex'){

            mapper = function(){
                emit(this.value.subject.sex, 1);
            }

        } else if(attr === 'mental_illness'){

            mapper = function(){
                emit(this.value.subject.mental_illness, 1);
            }

        } else if(attr === 'cause'){

            mapper = function(){
                emit(this.value.death.cause, 1);
            }

        } else if(attr === 'disposition'){

            mapper = function(){
                emit(this.value.death.disposition, 1);
            }

        } else if(attr === 'responsible_agency'){

            mapper = function(){
                emit(this.value.death.responsible_agency, 1);
            }
        }

        getDistinctCount(req._db.fatalities, mapper, function(err, body){

            if(err){
                res.status(404).send(err);
                return;
            }

            res.status(200).json(body);
        })

    } else {

        req._db.fatalities.distinct(attribute, function(err, body){

            if(err){
                log('error', 'distinct race', err);
                res.sendStatus(500);
            }

            log('trace', 'got distinct count');

            res.status(200).json(body);
        });
    }


});
*/

module.exports = router;