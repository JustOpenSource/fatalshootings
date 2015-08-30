var __base = __base || '../',
    c = require(__base + 'shared-config/constants'),
    log = c.getLog('shared-utils/http-get'),

    http = require('http');

function get(o, cb){

    log('trace', 'http-get request response: ' + o);

    var req = http.request(o, function(res) {

        //TODO: Add proper trace logging in this function
        log('trace', 'http-get request response');

        var status = res.statusCode,
            output = '';

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