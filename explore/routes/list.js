var c = require(__base + '../shared-config/constants'),
    log = c.getLog('explore/routes/list');
    
    //npm libraries
    express = require('express'),
    
    //application imports
    router = express.Router(),
    renderView = require(__base + '../shared-utils/render-view');

// url/list/
router.route('/')
.get(function(req, res){

    var page_title = 'Fatalaties List';

    renderView(req, res, 'fatality-list', {
    
        'limit' : req.query.limit,
        'page' : req.query.page
    
    }, {

        title: page_title,
        js: ['config/list'],
        css: ['list']
    
    });

})

.post(function(req,res){
    
    res.send('handle post data');

});

module.exports = router;