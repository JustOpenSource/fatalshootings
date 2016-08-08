// Load the SDK and UUID
var AWS = require('aws-sdk');
var fejson = require('./fejson');
var _ = require('underscore');

AWS.config.update({region: 'us-west-2', loglevel: 1});

var docClient = new AWS.DynamoDB.DocumentClient();

var pfunc = function(err, data) {
    if (err) {
        console.log(err, err.stack);
    } else {
        console.log(data);
    }
}

var tableName = 'sdf-test1';

_.each(fejson.rows, (item, index)=>{

        item.body = item.value;
        delete item.value;
        delete item.key;

        var params = {
               TableName: tableName,
               Item: item
        }

        docClient.put(params, pfunc);
});