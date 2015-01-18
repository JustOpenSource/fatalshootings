var express = require('express');
var router = express.Router();
var _ = require('underscore');
var c = require('../config/constants.js');

/* GET home page. */
router.get('/formatted/',function(req,res){
    var v = require('../db/utils/analysis_view');
    v.get(function(body){
        res.json(body)
    });
});

router.get('/normalized/compare/:id',function(req,res){
    
    var v = require('../db/utils/analysis_view');
    var n = require('../db/utils/normalizer');
    var p = {keys: []};
    if(req.params.id.indexOf(',')){
        p.keys = req.params.id.split(',');
    }else{
        p.keys.push(req.params.id);
    }
    v.get(function(body){
        if(typeof body !== 'undefined'){
            var nano = require('nano')(c.nano);
            var pf = nano.use('pf');
            var k = {keys: _.map(body.rows, function(row){ return row.key; })};
            console.log(k);
            pf.fetch(k, {}, function(err, data){
                if(err) throw err;
                if(typeof data !== undefined){
                    var clean = n.cleanResults(body)
                    var output = _.map(data.rows,function(element,index){
                        return {
                            orig: element,
                            dirty: body.rows[index],
                            clean: clean.rows[index]
                        }
                    });
                    res.render('explore/compare',{results: output });
                }else{
                    console.log('not fetch',data);
                }
            });
        }else{
            console.log('bad body',body);
        }
    },0,p);
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