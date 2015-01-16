var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/formatted/',function(req,res){
    var v = require('../db/utils/analysis_view');
    v.get(function(body){
        res.json(body)
    });
});

router.get('/normalized/',function(req,res){
    var v = require('../db/utils/analysis_view');
    var n = require('../db/utils/normalizer');
    v.get(function(body){
        res.json(n.cleanResults(body))
    });
});

module.exports = router;