var __base = __base || '../';
var c = require(__base + 'constants');
var log = c.getLog('routes/home');
var q = require('q');
var filterUtils = require(__base + 'utils/query-filters');
var router = require('express').Router();
var renderView = require(__base + 'utils/render-view');

// url/list/
router.route('/')
.get(function(req, res){

    var page_title = 'Fatal Encounters';

    renderView(req, res, 'home', {
       //view data
    }, {

        title: page_title,
        js: ['main/home'],
        css: ['home']
    });
})

module.exports = router;