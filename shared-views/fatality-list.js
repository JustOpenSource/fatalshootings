var __base = __base || '../',
    c = require(__base + 'shared-config/constants'),
    log = c.getLog(c.log, 'shared-views/fatality-list'),
    
    mongodb = require(__base + 'shared-utils/mongo-db'),
    getView = require(__base + 'shared-utils/get-view'),

    DATABASE = c.db.fatalities,
    COLLECTION = c.collection.fatalities,
    DEFAULT_LIMIT = 10;

function getModel (d, cb) {

    function getData(err, db, close){

        if(err){
            
            log('error', 'getData failed', err);            
            return;
        }

        var limit = parseInt(d.limit) || DEFAULT_LIMIT,
            page = parseInt(d.page) || 1,
            startAt = page * limit,
            collection = db.collection(COLLECTION),
            data = {
                page: page,
                limit: limit
            };

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

    	function buildModel(body, data){
        	
            return {
            	'body' : body,
            	'data' : data
        	}
    	}

        //get full count before applying limit
        function getCount(countCb){
            
            collection
            .find(queryFilter(), querySelect())
            .count(function(err, count){

            	if(err){
                    log('error', 'could not get count', err);
                
            		cb(err);
            	}

                log('trace', 'get count ' + count);
                
                countCb(count);
            
            })
        
        }
        
        //get result entries for current page
        function getResults(count){

            collection.find(queryFilter(), querySelect())

            .sort(querySort())

            .skip(startAt).limit(limit)

            .toArray(function(err, body){

                if(err){

            		log('error', 'could not get results', err);

           			cb(err);

                    close();

                    return;
            	}

                log('trace', 'got results, calling cb() and passing in model data');

	        	cb(null, {

	            	results: body,
	           		count: count,
	            	filters: getView('fatality-list-filter', {
                        //
                    }).html,
                    pagination: getView('components/pagination', {
                        count: count,
                        current: page,
                        limit: limit
                    }).html
                });

        		close();
            });
        }
        
        //init
        log('trace', 'attempting to get count');

        getCount(function(count){

            log('trace', 'attempting to get results');

            getResults(count);
        
        });
        
    }

    log('trace', 'attempt to connect to mongodb to process view model');

    mongodb(DATABASE, getData);
}

module.exports = getModel;