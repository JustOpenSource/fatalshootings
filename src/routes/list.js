var __base = __base || '../';
var c = require(__base + 'constants');
var log = require(__base + 'utils/log')('routes/list');
var router = require('express').Router();
var renderView = require(__base + 'utils/render-view');
var filterUtils = require(__base + 'utils/query-filters');

// url/list/
router.route('/')
.get(function(req, res){

    var page_title = 'Fatalaties List';

    renderView(req, res, 'fatality-list', {
        'filters' : {

            'name' : req.query.name,
            'cause' : req.query.cause,
            'age' : req.query.age,
            'race' : req.query.race,
            'sex' : req.query.sex,
            'country' : req.query.country,
            'state' : req.query.state,
            'zip' : req.query.zip,
            'age_from' : req.query.age_from,
            'age_to' : req.query.age_to,
            'date_from' : req.query.date_from,
            'date_to' : req.query.date_to,
            'state' : req.query.state,
            'zip' : req.query.zip,
            'year' : req.query.year,
            'month' : req.query.month,
            'limit' : req.query.limit,
            'page' : req.query.page,
            'record_state' : req.query.record_state,
            'assignee' : req.query.assignee
        }
    }, {

        title: page_title,
        js: ['main/list'],
        css: ['list']
    });
})

.post(function(req, res){

    log('trace', 'list filter post data', req.body);

    res.redirect(filterUtils.buildFilterURL(req.app.locals.url_root + '/list', req.body));

});

module.exports = router;