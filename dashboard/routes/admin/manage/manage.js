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
    
    e.readd('manage', 'preview_list', {}, function(output){
        
        c.l('output from manage/ read', output);
        
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

router.route('/filter')
.post(function(req, res){
    c.l('form data', req.body);

    res.send('coming soon');
});

    
router.route('/id/:id')
.get(function(req, res){
    
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

                res.render('shared/fatality-entry', {
                    results: process(body.rows[0]),
                    id_link_base: '/manage/id/',
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

})
.put(function(req, res){
    
    res.send('coming soon!');

})
.delete(function(req, res){
    
    res.send('coming soon!');

});

module.exports = router;