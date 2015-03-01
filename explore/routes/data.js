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

    data.filter.page = data.filter.page * data.filter.limit > data.count ? Math.ceil(data.count / data.filter.limit) : data.filter.page;

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
router.route('/api')
.get(function(req, res){

    log('trace', '/data/api query', req.query);

    var data = {};

    data.filter = filterUtils.validateFilters(req.query);

    data.collection = req._db.fatalities;

    getCount(data)
        .then(getResults)
        .then(function(body){

            log('trace', '/data/api response');
            res.json(body);
        })
        .fail(function(err) {

            log('error', 'could not get results', err);
            //error response
        });
});

router.route('/api/distinct/race')
.get(function(req, res){

    req._db.fatalities.distinct("value.subject.race", function(err, body){

        if(err){
            log('error', 'distinct race', err);
            return;
        }

        res.json(body);
    });
});

router.route('/api/distinct/cause')
.get(function(req, res){

    req._db.fatalities.distinct("value.death.cause", function(err, body){

        if(err){
            log('error', 'distinct cause', err);
            return;
        }

        res.json(body);
    });
});

router.route('/api/distinct/disposition')
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
                '/data/api?sex=female',
                '/data/api?race=African-American/Black',
                '/data/api?cause=automobile',
                '/data/api?state=MD',
                '/data/api?state=MD&sex=male'
            ],
            'pagination' : [
                '/data/api?sex=male&limit=5&page=2',
                '/data/api?sex=male&cause=gunshot&limit=5&page=2'
            ],
            'distinct' : [
                '/data/api/distinct/race',
                '/data/api/distinct/cause',
                '/data/api/distinct/disposition',
            ]
        }

    }, {

        title: 'Data API',
        js: ['main/data'],
        css: ['data']

    });
});

module.exports = router;