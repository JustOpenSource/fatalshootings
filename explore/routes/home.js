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



// url/data/api
router.route('/')
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

module.exports = router;