var AWS = require('aws-sdk');
var _ = require('underscore');
var log = require('../log')(__dirname);
var getSchema = require('../schema').getFullSchema;
var cache = require('memory-cache');
var fuzzy = require('fuzzy');

var fe = getSchema('fe', '1');

function handleError(err){
    console.log(err, err.stack);
}

class DbDriverDynamo {
    constructor(config) {

        this.config = {};
        this.config.table = config.table;

        AWS.config.update({region: 'us-west-2', loglevel: 1});

        this.docClient = new AWS.DynamoDB.DocumentClient();
    }

    handleError(err){
        console.log(err, err.stack);
    }

    processResults(items, filter, cb){
        var items = this.applyFilter(items, filter);

        cb(null, {
            items : this.applyPagination(items, filter),
            count : items.length
        });
    }

    applyFilter(items, filter){

        function testBase(filterBy, value, body){
            var result = false;

            if(!filterBy){
                return true;
            }

            //try so we don't have to test value path
            try {
                result = body();
            } catch(err){}

            return result;
        }

        function testValue(filterBy, value){
            return testBase(filterBy, value, ()=>{
                return value.trim().toLowerCase() === filterBy.toLowerCase()
            });
        }

        function testText(filterBy, value){
            return testBase(filterBy, value, ()=>{
                var results = fuzzy.filter(filterBy, [value]);
                return results.length > 0;
            });
        }

        function testFromNum(filterBy, value){
            return testBase(filterBy, value, ()=>{
                return parseInt(filterBy) <= parseInt(value)
            });
        }

        function testToNum(filterBy, value){
            return testBase(filterBy, value, ()=>{
                return parseInt(filterBy) >= parseInt(value)
            });
        }

        //LOOP OVER EACH ITEM
        items = _.filter(items, (item)=>{

            var shouldReturn = false;
        
            if( testValue(filter.sex, item.body.subject.sex)
                && testValue(filter.race, item.body.subject.race)
                && testValue(filter.cause, item.body.death.cause) 
                && testFromNum(filter.age_from, item.body.subject.age) 
                && testToNum(filter.age_to, item.body.subject.age)
                && testText(filter.name, item.body.subject.name) ){

                shouldReturn = true;
            }

            return shouldReturn;
        });

        return items;
    }

    applyPagination(items, filter){
        return items.slice(filter.skip, filter.skip + filter.limit);
    }

    /* PUBLIC METHODS */
    getResult(id, cb) {

        var params = {};
        params.RequestItems = {};
        params.RequestItems[this.config.table] = {
            Keys: [{ "id" : id }]
        };

        this.docClient.batchGet(params, (err, data)=>{
            if (err) this.handleError(err)
            else cb(err, data);
        });
    }

    setResult(record, cb) {

        var setResultParam = {
            TableName: driverInstance.config.table,
            Item : record
        };  

        this.docClient.put(setResultParam, (err, data)=>{
            if (err) this.handleError(err)
            else cb(err, data);
        });
    }

    getResults(filter, cb) {

        var RESULTS_CACHE_KEY = 'table-results-cache';

        var params = {
            TableName: this.config.table,
            ProjectionExpression: "id, body",
            KeyConditions: {
                id: {
                    ComparisonOperator: 'NE',
                    AttributeValueList: [false]
                },
            },
        };

        var cachedResults = cache.get(RESULTS_CACHE_KEY);

        if(cachedResults){

            this.processResults(cachedResults, filter, cb);

        } else {
            this.docClient.scan(params, (err, data)=>{
                if (err) {
                    
                    this.handleError(err)

                } else {

                    if(!cache.get(RESULTS_CACHE_KEY)){
                        cache.put(RESULTS_CACHE_KEY, data.Items);
                    }

                    this.processResults(data.Items, filter, cb);
                }
            });
        }

        
    }

    setResults() {
        //not implimented yet
        return false;
    }

    getAggregateCount() {
        
    }
}

module.exports = DbDriverDynamo;



/**

const driverInstance = new DbDriverDynamo({
    'table' : 'sdf-devo'
});

var getResult = driverInstance.getResult('fatality_1258', (data)=>{ 
    var response = data.Responses[driverInstance.config.table];
    log('trace', 'get single response', response);
});

var setResult = driverInstance.setResult({
        "id" : "2222221",
        "foo" : "barooooo",
        "she" : "asdfasdfasdfasdfads"
    }, (err, data)=>{
        var response = data;
        log('trace', 'set single response', response);
    }
);

var getResults = driverInstance.getResults(null, (err, data)=>{
        var response = data;
        log('trace', 'set single response', response.Items.length);
    }
);

**/
