var AWS = require('aws-sdk');

var AWS_REGION = 'us-west-2';

AWS.config.update({region: AWS_REGION, loglevel: 1});
AWS.config.apiVersions = {
  lambda: '2015-03-31',
  // other service API versions
};

var lambda = new AWS.Lambda();

module.exports = function(filter, cb){

    var params = {
      FunctionName: 'sdf-filter-function', /* required */
      Payload: JSON.stringify(filter)
    };

    lambda.invoke(params, function(err, data) {
      if (err) cb(err);
      else cb(null, data.Payload)         
    });
}