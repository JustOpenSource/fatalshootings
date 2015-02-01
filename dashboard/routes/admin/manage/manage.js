var express = require('express'),
    router = express.Router(),
    c = require(__base + 'config/constants'),
    nano = require('nano')(c.nano),
    db = nano.use(c.db_name),
    _ = require('underscore'),
    e = require(__base + 'db/models/entry'),
    validate = require(__base + 'db/utils/validator');

router.route('/')
    
    .get(function(req,res){
        
        e.read({}, function(output){
            
            res.render('shared/fatality-list', {
                results: output,
                locals: { 
                    title: 'List of Fatalities',
                    js: ['config/manage-list'],
                    css: ['app/manage-list']
                }
            });
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
                    function process(entry){
                        if(!entry){
                            return {};
                        }

                        entry.form = {};
                        entry.schema = JSON.stringify(validate.schemas);
                        entry.form.causesOfDeath = validate.schemas['/fe/death/v1'].properties.cause.enum;
                        
                        console.log('entry schema');
                        console.log(entry.schema);

                        return entry;
                    }

                    console.log('testing111111');

                    res.render('shared/fatality-entry', {
                        results: process(body.rows[0]),
                        
                        partials: {
                            death: 'shared/fatality-entry-partials/death',
                            location: 'shared/fatality-entry-partials/location',
                            subject: 'shared/fatality-entry-partials/subject'
                        },
                        
                        locals: { 
                            title: 'Fatality',
                            js: ['config/manage-item'],
                            css: ['app/manage-item']
                        }
                    });

                } else {
                    
                    res.status(404).send('Not Found');
                }
            });

        } else {
            
            res.status(404).send('Invalid ID');
        }

    }).put(function(req, res){
        
        res.send('coming soon!');
    
    }).delete(function(req, res){
        
        res.send('coming soon!');

    });

module.exports = router;