var c = require(__base + '../shared-config/constants'),
    log = c.getLog('admin/routes/list'),
    
    //npm libraries
    express = require('express'),
    
    //application imports
    router = express.Router(),
    renderView = require(__base + '../shared-utils/render-view'),
    filterUtils = require(__base + '../shared-utils/query-filters');


// url/list/
router.route('/')
.get(function(req, res){

    log('trace', 'list filter query', req.query);

    var page_title = 'Fatalaties List';

    renderView(req, res, 'fatality-list', {
        'admin' : true,
        'filters' : {

            'name' : req.query.name,
            'cause' : req.query.cause,
            'age' : req.query.age,
            'race' : req.query.race,
            'sex' : req.query.sex,
            'country' : req.query.country,
            'state' : req.query.state,
            'zip' : req.query.zip,
            'date_from' : req.query.date_from,
            'date_to' : req.query.date_to,
            'limit' : req.query.limit,
            'page' : req.query.page
        }
    }, {

        title: page_title,
        js: ['main/list'],
        css: ['list']
    });
})


.post(function(req, res){

    log('trace', 'list filter post data', req.body);

    res.redirect(filterUtils.buildFilterURL(c.url.list, req.body));

});

module.exports = router;