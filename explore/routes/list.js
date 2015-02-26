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
        'page' : req.query.page,
        'filters' : {

            'name' : req.query.name,
            'cause' : req.query.cause,
            'age' : req.query.age,
            'race' : req.query.race,
            'sex' : req.query.sex,
            'country' : req.query.country,
            'state' : req.query.state,
            'zip' : req.query.zip,
            'date_from' : req.query.date_from,
            'date_to' : req.query.date_to
        }
    
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