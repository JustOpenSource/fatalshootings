var __base = __base || '../';
var c = require(__base + 'constants');
var log = require(__base + 'utils/log')('routes/home');
var router = require('express').Router();
var renderView = require(__base + 'utils/render-view');

// url/list/
router.route('/')
.get(function(req, res){

    res.redirect('/list');
    return;

    var page_title = 'Fatal Encounters';

    renderView(req, res, 'home', {
       //view data
    }, {

        title: page_title,
        js: ['main/home'],
        css: ['home']
    });
});

module.exports = router;