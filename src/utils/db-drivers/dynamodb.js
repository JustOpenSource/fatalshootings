var __base = __base || '../../'
var AWS = require('aws-sdk');
var _ = require('underscore');
var log = require('../log')(__dirname);
var getSchema = require('../schema').getFullSchema;
var cache = require('memory-cache');
var fuzzy = require('fuzzy');

//google docs json src
//https://spreadsheets.google.com/feeds/list/1dKmaV_JiWcG8XBoRgP8b4e9Eopkpgt7FL7nyspvzAsE/od6/public/basic?alt=json

var fe = getSchema('fe', '1');
var RESULTS_CACHE_KEY = 'table-results-cache';
var AWS_REGION = 'us-west-2';
const RECURSIVE_SET_TIMEOUT = 10;
const SET_PAGINATION_TIMEOUT = 10;

const TEMP_DB = __base + '../data/fe.json';

function handleError(err){
    console.log(err, err.stack);
}

class DbDriverDynamo {
    constructor(config){

        this.config = {};
        this.config.table = config.table;
        this.tempCollection = [];

        AWS.config.update({region: AWS_REGION, loglevel: 1});

        this.docClient = new AWS.DynamoDB.DocumentClient();
    }

    handleError(err){
        console.log(err, err.stack);
    }

    addResults(items){__base + '../data/fe.json'

        //this.tempCollection = this.tempCollection.concat(items);
        this.tempCollection = items;
    }

    processResults(items, filter, cb){
        let filteredItems = this.applyFilter(items, filter);

        cb(null, {
            items : this.applyPagination(filteredItems, filter),
            count : filteredItems.length
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

            //console.log(value);

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
        
            if( testValue(filter.sex, item.person_gender)
                && testValue(filter.race, item.person_race)
                && testValue(filter.cause, item.death_cause) 
                && testFromNum(filter.age_from, item.person_age) 
                && testToNum(filter.age_to, item.person_age)
                && testText(filter.name, item.person_name) ){

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
    setResult(record, cb) {

        if(!record.id){
            cb(null, true);
            return;
        }

        var setResultParam = {
            TableName: this.config.table,
            Item : record
        };

        this.docClient.put(setResultParam, (err, data)=>{
            data.id = record.id;

            if (err) {
                log('error', record.id);
                this.handleError(err);
            }

            else {
                cb(err, data);
            }
        });
    }

    setResults(collection, cb) {

        log('trace', 'setResults collection length', collection.length);

        var t = this;

        let itemIndex = 0;
        let itemCount = 0;

        function recursiveSet() {
            t.setResult(collection[itemIndex], (err, response)=>{
                if(err){
                    log('error', err);
                    cb(err);
                }

                log('trace', 'record set', response.id);
                log('trace', 'updated collection index', itemIndex);

                itemIndex++;

                if(collection[itemIndex]) {

                    setTimeout(()=>{
                        recursiveSet();
                    }, RECURSIVE_SET_TIMEOUT)
                
                } else {
                    cb(null, true);
                }
            });
        }

        recursiveSet();
    }

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

    getResults(filter, cb) {



        function getResults(){
            //TEMP UNTIL DATA PIPELINE IS WIRED
            var fullDBJSON = require(TEMP_DB);
            var data = {};
            data.count = 13159;
            data.body = fullDBJSON.items;

            return data.body;
        }

        this.addResults(getResults());
        this.processResults(this.tempCollection, filter, cb);


        /*



        let cachedResults = cache.get(RESULTS_CACHE_KEY);

        if(cachedResults){
        //if(false){

            this.processResults(cachedResults, filter, cb);

        } else {
            
            var params = {
                TableName: this.config.table,
                ProjectionExpression: "id, person_name, person_age, person_race, person_gender, death_cause, death_location_state, death_date",
                KeyConditions: {
                    id: {
                        ComparisonOperator: 'NE',
                        AttributeValueList: [false]
                    },
                },
            };

            if(filter.LastEvaluatedKey){
                params.ExclusiveStartKey = filter.LastEvaluatedKey;
            }

            this.docClient.scan(params, (err, data)=>{
                if (err) {
                    
                    this.handleError(err)

                } else {

                    console.log('=======================');
                    console.log(data.Items.length);
                    console.log(data.LastEvaluatedKey);

                    if(data.LastEvaluatedKey){
                        filter.LastEvaluatedKey = data.LastEvaluatedKey;

                        this.addResults(data.Items);

                        setTimeout(()=>{
                            this.getResults(filter, cb);
                        }, SET_PAGINATION_TIMEOUT)

                        
                    } else {

                        this.addResults(data.Items);
                        this.processResults(this.tempCollection, filter, cb);
                    
                        if(!cache.get(RESULTS_CACHE_KEY)){
                            cache.put(RESULTS_CACHE_KEY, this.tempCollection);
                        }
                    }
                }
            });   
        }
        */
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
