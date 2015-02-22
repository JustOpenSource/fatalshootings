var c = require(__base + '../shared-config/constants'),
    
    //npm libraries
    express = require('express'),
    _ = require('underscore'),
    
    //application imports
    router = express.Router(),
    renderComponent = require(__base + '../shared-utils/render-component');

// url/list/
router.route('/')
.get(function(req, res){

    var PAGE_TITLE = 'Fatalaties List';

    renderComponent(req, res, 'fatality-list', {
    
        'limit' : req.query.limit,
        'page' : req.query.page
    
    }, {

        title: PAGE_TITLE,
        js: ['config/list'],
        css: ['list']
    
    });

})

.post(function(req,res){
    
    res.send('handle post data');

});

module.exports = router;