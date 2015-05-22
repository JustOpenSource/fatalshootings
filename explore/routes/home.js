var c = require(__base + '../shared-config/constants'),
    log = c.getLog('explore/routes/home'),

    q = require('q'),

    filterUtils = require(__base + '../shared-utils/query-filters'),
    renderView = require(__base + '../shared-utils/render-view');

//npm libraries
express = require('express'),

    //application imports
    router = express.Router(),
    renderView = require(__base + '../shared-utils/render-view');



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