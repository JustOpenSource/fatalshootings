var express = require('express'),
    router = express.Router(),
    c = require('../config/constants'),
    nano = require('nano')(c.nano),
    db = nano.use(c.db_name),
    _ = require('underscore'),
    e = require('../db/models/entry');

router.route('/')
    
    .get(function(req,res){
        
        e.read({}, function(output){
            
            res.render('gui/list',{results: output,link_base:'/gui/'});
        
        });
    
    })

    .post(function(req,res){
        
        res.send('coming soon');
    
    });
    
router.route('/:id')

    .get(function(req,res){
        
        if(_.isString(req.params.id)){
            var readKeys = {
                keys: [req.params.id]
            };

            e.read(readKeys, function(body){
                
                if(body.total_rows > 0){
                    
                    //business logic
                    var process = require('./process-single');

                    res.render('app/item/index', {
                        results: process(body.rows[0]),
                        
                        partials: {
                            death: 'app/item/partials/death',
                            location: 'app/item/partials/location',
                            subject: 'app/item/partials/subject'
                        },
                        testt: 'foo',
                        locals: { 
                            title: 'testing title',
                            init: 'item'
                        }
                    });

                } else {
                    
                    res.status(404).send('Not Found');
                }
            });

        } else {
            
            res.status(404).send('Invalid ID');
        }

    }).put(function(req,res){
        
        res.send('coming soon!');
    
    }).delete(function(req,res){
        
        res.send('coming soon!');

    });

module.exports = router;