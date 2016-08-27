var __base = __base || '../';
var c = require(__base + 'constants');
var log = require(__base + 'utils/log')('routes/contact');
var router = require('express').Router();
var renderView = require(__base + 'utils/render-view');


// url/integrations/
router.route('/')
.get(function(req, res){

    var page_title = 'Integrations';

    renderView(req, res, 'integrations', {
        "msg" : req.query.msg
    }, {

        title: page_title
    });
})

.post(function(req, res){

    log('trace', 'post date', req.body);

});

module.exports = router;