var express = require('express');
var router = express.Router();
var c = require('../config/constants');
var nano = require('nano')(c.nano);
var db = nano.use(c.db_name);
var _ = require('underscore');
var e = require('../db/models/entry');

router.route('/')
    .get(function(req,res){
        e.read({},function(output){
            res.render('gui/list',{results: output,link_base:'/gui/'});
        })
    })
    .post(function(req,res){
        res.send('coming soon');
    });
    
router.route('/:id')
    .get(function(req,res){
        if(_.isString(req.params.id)){
            e.read({keys: [req.params.id]},function(body){
                if(body.total_rows > 0){
                    res.render('gui/single',{results: body.rows[0],link_base:'/gui/'});
                }else{
                    res.status(404).send('Not Found');
                }
            });
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