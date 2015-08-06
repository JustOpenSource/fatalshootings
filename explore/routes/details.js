var c = require(__base + '../shared-config/constants'),
    log = c.getLog('explore/routes/details');
    
    //router
    router = require('express').Router(),
    
    renderView = require(__base + '../shared-utils/render-view');


// url/details/
router.route('/:id')
.get(function(req, res){

    var page_title = 'Details';

    renderView(req, res, 'details', {
    
    	"id" : req.params.id
    
    }, {

        title: page_title,
        css: ['details']
    });
});

module.exports = router;