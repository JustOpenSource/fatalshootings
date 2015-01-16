var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/formatted/',function(req,res){
    var v = require('../db/utils/analysis_view');
    v.get(function(body){
        res.json(body)
    });
});

router.get('/normalized/specific/:id',function(req,res){
    var v = require('../db/utils/analysis_view');
    var n = require('../db/utils/normalizer');
    var params = {keys: []};
    if(req.params.id.indexOf(',')){
        params.keys = req.params.id.split(',');
    }else{
        params.keys.push(req.params.id);
    }
    v.get(function(body){
        if(typeof body !== 'undefined'){
            var output = {
                orig: body,
                clean: n.cleanResults(body),
            }
            res.json(output);
        }else{
            console.log('bad body',body);
        }
    },0,params);
    
});

router.get('/normalized/',function(req,res){
    var v = require('../db/utils/analysis_view');
    var n = require('../db/utils/normalizer');
    v.get(function(body){
        res.json(n.cleanResults(body))
    });
});

module.exports = router;