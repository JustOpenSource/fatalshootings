var __base = __base || '../',
    c = require(__base + 'shared-config/constants'),
    mongodb = require(__base + 'shared-utils/mongo-db'),

   	//move to constants
    DATABASE = c.db.fatalities,
    COLLECTION = c.collection.fatalities,
    DEFAULT_LIMIT = 10;

function getModel (d, cb) {

    function getData(err, db, close){

        if(err){
            
            c.l('err', err);            
            return;
        }

        var limit = parseInt(d.limit) || DEFAULT_LIMIT,
            page = parseInt(d.page),
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
            		cb(err);
            	}
                
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

            		c.l('err', err);

           			cb(err);

                    close();

                    return;
            	}

	        	cb(null, {

	            	results: body,
	           		count: count,
	            	filters: filterOptions()

                });

        		close();

            });
        }
        
        //init
        getCount(function(count){

            getResults(count);
        
        });
        
    }

    mongodb(DATABASE, getData);
}

module.exports = getModel;