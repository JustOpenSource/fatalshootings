var __base = __base || '../';
var c = require(__base + 'constants');
var log = require(__base + 'utils/log')('routes/user');
var renderView = require(__base + 'utils/render-view');
var router = require('express').Router();

// url/list/
router.route('/')
.get(function(req, res){

    var page_title = 'Fatal Encounters';

    renderView(req, res, 'user', {
       //view data
    }, {

        title: page_title,
        js: ['main/home'],
        css: ['home']
    });
})

module.exports = router;