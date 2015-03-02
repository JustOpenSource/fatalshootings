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

router.route('/api/v1/distinct/race')
.get(function(req, res){

    req._db.fatalities.distinct("value.subject.race", function(err, body){

        if(err){
            log('error', 'distinct race', err);
            return;
        }

        res.json(body);
    });
});

router.route('/api/v1/distinct/cause')
.get(function(req, res){

    req._db.fatalities.distinct("value.death.cause", function(err, body){

        if(err){
            log('error', 'distinct cause', err);
            return;
        }

        res.json(body);
    });
});

router.route('/api/v1/distinct/disposition')
.get(function(req, res){

    req._db.fatalities.distinct("value.death.disposition", function(err, body){

        if(err){
            log('error', 'distinct cause', err);
            return;
        }

        res.json(body);
    });
});

router.route('/')
.get(function(req, res){

    renderView(req, res, 'data-api', {

        url: {

            'attr' : [
                '/data/api/v1?sex=female',
                '/data/api/v1?sex=female&limit=30',
                '/data/api/v1?race=Caucasian-American/White',
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
                '/data/api/v1/distinct/cause',
                '/data/api/v1/distinct/disposition',
            ]
        }

    }, {

        title: 'Data API',
        js: ['main/data'],
        css: ['data']

    });
});

module.exports = router;