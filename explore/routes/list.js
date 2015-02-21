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

        //abstract this into new paginationModel()
        var FIRST_SET = 10,
            LAST_SET = 1;

        var MORE_PAGES_THAN = FIRST_SET + LAST_SET + 2;
 
        var paginationData = {
            disablePrev: true,
            disableNext: true,
            pages : false,
            max: false
        }

        var totalPages = Math.floor(model.data.count / model.data.limit);

        //c.l('totalPages', totalPages);

        var i = totalPages;

        if(totalPages > MORE_PAGES_THAN){

        } else {
            while(i > 0){
                c.l(i)

                paginationData.pages[i] = {
                    active: model.data.page === i ? true : false,
                    number: i
                }

                i--;
            }
        }

        

        //abstract this into renderTemplate() function
        var paginationTemplate = fs.readFileSync(__base + '../shared-views/components/pagination.html').toString();
        var pagination = mustache.render(paginationTemplate, paginationData);

        //c.l('pagination', pagination);
        //c.l('paginationData', paginationData);

        res.render('fatality-list', {
            results: model.body,
            count: model.data.count,
            filters: filterOptions(),
            pagination: {
                view: pagination,
                data: paginationData
            },
            locals: { 
                title: 'List of Fatalities',
                js: ['config/list'],
                css: ['list']
            }
        });

        close();
    }

    function buildModel(body, data){
        return {
            'body' : body,
            'data' : data
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
            collection = db.collection('fe'),
            data = {
                page: page,
                limit: limit
            }

        function getCount(cb){
            collection.find(queryFilter(), querySelect()).count(function(err, count){
                cb(count);
            })
        }
        
        
        function getResults(count){
            collection.find(queryFilter(), querySelect())

            .sort(querySort())

            .skip(startAt).limit(limit)
            
            .toArray(function(err, body){
                data.count = count;

                render(err, buildModel(body, data), close);
            });
        }
        
        getCount(function(count){
            getResults(count);
        });

    }

    mongodb('fe', getList);

})

.post(function(req,res){
    
    res.send('handle post data');

});

module.exports = router;