var c = require(__base + 'config/constants');
var e = require(__base + 'db/models/entry');

var express = require('express');
var router = express.Router();
var nano = require('nano')(c.nano);
var db = nano.use(c.db_name);
var _ = require('underscore');

router.route('/')
    .get(function(req,res){
        e.read({},function(output){
            res.json(output);
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
                    res.json(body.rows[0]);
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