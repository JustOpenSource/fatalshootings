var express = require('express');
var router = express.Router();
var c = require('../config/constants');
var nano = require('nano')(c.nano);
var db = nano.use(c.db_name);
var _ = require('underscore');

router.route('/')
    .get(function(req,res){
        db.view('basic','all',{},function(err,body){
            if(err) throw err;
            res.json(body);
            //res.render('data/list',{results: body,link_base:'/data/'});
        })
    })
    .post(function(req,res){
        res.send('coming soon');
    });
    
router.route('/:id')
    .get(function(req,res){
        
        if(_.isString(req.params.id)){
            db.view('basic','all',{keys: [req.params.id]},function(err,body){
                if(err) throw err;
                if(body.total_rows > 0){
                    res.render('data/single',{results: body.rows[0],link_base:'/data/'});
                }else{
                    res.status(404).send('Not Found');
                }
            })    
        }else{
            res.status(404).send('Invalid ID');
        }
    })
    .put(function(req,res){
        res.send('coming soon!');
    })
    .delete(function(req,res){
        res.send('coming soon!');
    });

module.exports = router;