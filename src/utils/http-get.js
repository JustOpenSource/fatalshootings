var __base = __base || '../';
var c = require(__base + 'constants');
var log = require(__base + 'utils/log')('http-get');
var http = require('http');

function get(path, cb){

    log('trace', 'http-get request response: ' + path);

    var req = http.request(path, function(res) {

        log('trace', 'http-get request response');

        var status = res.statusCode;
        var output = '';

        res.setEncoding('utf8');

        res.on('data', function(chunk) {

            output += chunk;

        });

        res.on('end', function() {

            if(status !== 200){

                log('error', 'http-get request response');

                cb(status);

            } else {

                log('trace', 'http-get request response success');

                cb(null, JSON.parse(output));
            }
        });
    });

    req.end();
}

module.exports = get;