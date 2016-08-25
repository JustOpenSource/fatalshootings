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
var getFilteredDataDev = require(__base + 'utils/get-filtered-data-dev');
var Db = require(__base + 'utils/db-drivers/dynamodb');

const dbInstance = new Db({
    'table' : 'sdf-test2'
});

//TODO: Uncomment this to run in dev mode
//TODO: make this actually run based on NODE_ENV='development';
//var getFilteredData = getFilteredDataDev;
function getResults(data){

    var deferred = q.defer();

    let noFilter = true;

    if( data.filter.name 
        || data.filter.age_from 
        || data.filter.age_to
        || data.filter.sex
        || data.filter.cause
        || data.filter.race){

        noFilter = false;
    }

    if(noFilter){
        setTimeout(()=>{
            data.count = 0;
            data.body = [];
            data.hideList = true;

            deferred.resolve(data);
        }, 50);
    }

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

function getResult(data){
    var deferred = q.defer();

    dbInstance.getResult(data.id, (err, response)=>{
            if(err){
                log('error', 'could not get results', err);
                deferred.reject(err);
            }

            data.value = response.Responses['sdf-test2'][0];
            deferred.resolve(data);
        }
    );

    return deferred.promise;
}

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

    getResults(data).then((body)=>{
        res.json(body);
    }).catch(function(err){
        log('error', 'could not get results', err);
        res.sendStatus(500);
    });
});

router.route('/api/:version/details/:record_id')
.get(function(req, res){
    var data = {
        'id' : req.params.record_id
    };

    getResult(data).then((body)=>{
        res.json(body);
    }).catch(function(err){
        log('error', 'could not get results', err);
        res.sendStatus(500);
    });
});

/*
THIS ROUTE'S RESPONSE OUT OF DATE
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

module.exports = router;