var AWS = require('aws-sdk');
var _ = require('underscore');
var log = require('../log')(__dirname);
var getSchema = require('../schema').getFullSchema;

var fe = getSchema('fe', '1');

console.log(fe);

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

        var scanFilter;

        function byAttributeValues(keyValuePairs){
            var attributeObject = {};

            _.each(Object.keys(keyValuePairs), (key, value)=>{
                console.log(key);
                console.log(value);
            });

            return attributeObject;
        }

        console.log(byAttributeValues({
            foo: 'bar',
            a: 1,
            b: 2,
            coooo: 'adsfadsfdf'
        }));

        if(filter === null){
            //all results where ID != null
            scanFilter = {
                id: {
                    ComparisonOperator: 'NE',
                    AttributeValueList: [
                        null
                    ]
                }
            }
        }

        var params = {
            TableName: this.config.table,
            ScanFilter: scanFilter
        };

        this.docClient.scan(params, (err, data)=>{
            if (err) this.handleError(err)
            else cb(err, data);
        });
    }

    setResults() {
        //not implimented yet
        return false;
    }

    getAggregateCount() {
        
    }
}

const driverInstance = new DbDriverDynamo({
    'table' : 'sdf-devo'
});

/*
var getResult = driverInstance.getResult('fatality_1258', (data)=>{ 
    var response = data.Responses[driverInstance.config.table];
    log('trace', 'get single response', response);
});
*/

/*
var setResult = driverInstance.setResult({
        "id" : "2222221",
        "foo" : "barooooo",
        "she" : "asdfasdfasdfasdfads"
    }, (err, data)=>{
        var response = data;
        log('trace', 'set single response', response);
    }
);
*/

var getResults = driverInstance.getResults(null, (err, data)=>{
        var response = data;
        log('trace', 'set single response', response.Items.length);
    }
);

console.log( );

