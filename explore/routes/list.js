var express = require('express'),
    _ = require('underscore'),
    router = express.Router(),
    c = require(__base + '../shared-config/constants'),
    mongodb = require(__base + '../shared-utils/mongo-db'),
    validate = require(__base + 'db/utils/validator');

router.route('/')
.get(function(req, res){

    function filterOptions(){
        return {};
    }

    function queryFilter(){
        return {};
    }

    function querySelect(){
        return {
            "value.subject.name" : 1,
            "value.subject.age" : 1,
            "value.subject.race" : 1,
            "value.subject.sex" : 1,
            "value.death.cause" : 1,
            "value.death.event.date" : 1,
            "value.location.state" : 1
        }
    }

    function querySort(){
        return { 
            "value.death.event.date" : -1 
        }
    }

    function render(err, body, close){

        if(err){
            c.l('err', err);
            res.render('error');
        }

        res.render('fatality-list', {
            results: body,
            filters: filterOptions(),
            locals: { 
                title: 'List of Fatalities',
                js: ['config/list'],
                css: ['list']
            }
        });

        close();
    }

    function getList(err, db, close){

        if(err){
            c.l('err', err);
            return;
        }

        var limit = parseInt(req.query.limit),
            page = parseInt(req.query.page),
            startAt = page * limit,
            collection = db.collection('fe');

        collection.find(queryFilter(), querySelect())

        .sort(querySort())

        .skip(startAt).limit(limit)
        
        .toArray(function(err, body){
            render(err, body, close);
        });

    }

    mongodb('fe', getList);

})

.post(function(req,res){
    
    res.send('coming soon');

});

module.exports = router;