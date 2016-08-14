var __base = __base || '../';
var c = require(__base + 'constants');
var log = require(__base + 'utils/log')('routes/contact');
var router = require('express').Router();
var renderView = require(__base + 'utils/render-view');


// url/list/
router.route('/')
.get(function(req, res){

    var page_title = 'Contact Us';

    renderView(req, res, 'contact', {
    	"msg" : req.query.msg
    }, {

        title: page_title
    });
})

.post(function(req, res){

    log('trace', 'post date', req.body);

});

module.exports = router;