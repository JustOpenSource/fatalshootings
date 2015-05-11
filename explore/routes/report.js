var c = require(__base + '../shared-config/constants'),
    log = c.getLog('explore/routes/report');
    
    //router
    router = require('express').Router(),
    
    renderView = require(__base + '../shared-utils/render-view');


function cleanPost(report){
    return report;
}

// url/list/
router.route('/')
.get(function(req, res){

    var page_title = 'Report A Death';

    renderView(req, res, 'report', {
    	//report params
    }, {
    	//page params
        title: page_title,
        css: ['reportADeathForm']
    });
})

.post(function(req, res){

    log('trace', 'post data', req.body);

    var report = cleanPost(req.body);

    req._db.fatalities.insert(req.body, function(err, body){

        log('trace', 'new entry added');
    });
});

module.exports = router;