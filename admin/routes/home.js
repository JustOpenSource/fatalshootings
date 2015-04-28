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

router.route('/')
.get(function(req, res){

    var page_title = "Home"

    renderView(req, res, 'admin-home', {
        "msg" : req.query.msg
    }, {

        title: page_title
    });

});

module.exports = router;