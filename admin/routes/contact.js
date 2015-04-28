var c = require(__base + '../shared-config/constants'),
    log = c.getLog('explore/routes/contact');
    
    //router
    router = require('express').Router(),
    
    renderView = require(__base + '../shared-utils/render-view');


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