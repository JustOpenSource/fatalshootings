var c = require(__base + '../shared-config/constants'),
    log = c.getLog('explore/routes/data'),

    q = require('q'),

    filterUtils = require(__base + '../shared-utils/query-filters'),
    renderView = require(__base + '../shared-utils/render-view');

    //npm libraries
    express = require('express'),

    //application imports
    router = express.Router(),
    renderView = require(__base + '../shared-utils/render-view');


function getCount(data) {

    log('trace', 'attempt to get count');

    var deferred = q.defer();

    data.collection.find(filterUtils.queryFilter(data.filter), filterUtils.querySelect())
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

function getResults(data){

    log('trace', 'attempt to get results');

    var deferred = q.defer();

    data.collection.find(filterUtils.queryFilter(data.filter), filterUtils.querySelect())
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

// url/data/api
router.route('/api/v1/')
.get(function(req, res){

    log('trace', '/data/v1/api query', req.query);

    var data = {};

    data.filter = filterUtils.validateFilters(req.query);

    data.collection = req._db.fatalities;

    getCount(data)
        .then(getResults)
        .then(function(body){

            log('trace', '/data/api/v1 response');
            res.json(body);
        })
        .fail(function(err){

            log('error', 'could not get results', err);
            //error response
        });
});

router.route('/api/v1/distinct/:attr')
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

            res.json(body);
        })

    } else {

        req._db.fatalities.distinct(attribute, function(err, body){

            if(err){
                log('error', 'distinct race', err);
                return;
            }

            log('trace', 'got distinct count');

            res.json(body);
        });
    }


});

router.route('/')
.get(function(req, res){

    renderView(req, res, 'data-api', {

        url: {

            'attr' : [
                '/data/api/v1?sex=female',
                '/data/api/v1?sex=female&limit=30',
                '/data/api/v1?race=European-American/White',
                '/data/api/v1/?cause=automobile',
                '/data/api/v1/?state=MD',
                '/data/api/v1/?state=MD&sex=male',
                '/data/api/v1/?limit=false',
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