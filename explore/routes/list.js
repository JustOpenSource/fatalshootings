var c = require(__base + '../shared-config/constants'),
    
    //npm libraries
    express = require('express'),
    _ = require('underscore'),
    mustache = require('mustache'),
    
    //application imports
    router = express.Router(),
    mongodb = require(__base + '../shared-utils/mongo-db'),
    validate = require(__base + 'db/utils/validator'), 
    fs = require('fs'),

    //defaults
    DEFAULT_LIMIT = 10;

// url/list/
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
            "value.subject.name" : true,
            "value.subject.age" : true,
            "value.subject.race" : true,
            "value.subject.sex" : true,
            "value.death.cause" : true,
            "value.death.event.date" : true,
            "value.location.state" : true
        }
    }

    function querySort(){
        return { 
            "value.death.event.date" : -1
        }
    }

    function render(err, model, close){

        if(err){
            c.l('err', err);
            res.render('error');
        }

        var paginationTemplate = fs.readFileSync(__base + '../shared-views/components/pagination.html').toString();

        var pagination = mustache.render(paginationTemplate, {});

        c.l('pagination', pagination);

        res.render('fatality-list', {
            results: model.body,
            count: model.count,
            filters: filterOptions(),
            pagination: pagination,
            locals: { 
                title: 'List of Fatalities',
                js: ['config/list'],
                css: ['list']
            }
        });

        close();
    }

    function buildModel(body, count){
        return {
            'body' : body,
            'count' : count
        }
    }

    function getList(err, db, close){

        if(err){
            c.l('err', err);
            return;
        }

        var limit = parseInt(req.query.limit) || DEFAULT_LIMIT,
            page = parseInt(req.query.page),
            startAt = page * limit,
            collection = db.collection('fe');

        collection.find(queryFilter(), querySelect())

        .sort(querySort())

        .skip(startAt).limit(limit)
        
        .toArray(function(err, body){
            render(err, buildModel(body, body.length), close);
        });

    }

    mongodb('fe', getList);

})

.post(function(req,res){
    
    res.send('handle post data');

});

module.exports = router;