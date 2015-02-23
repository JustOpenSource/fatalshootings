var __base = __base || '../../',
    c = require(__base + 'config/constants'),
    log = c.getLog(c.log, 'shared-utils/http-get'),

    http = require('http');

function get(o, cb){

	var req = http.request(o, function(res) {
		
		var status = res.statusCode,
			output = '';

		res.setEncoding('utf8');
	
		res.on('data', function(chunk) {
			
			output += chunk;
		});

		res.on('end', function() {

			if(status !== 200){

				cb(status);
			
			} else {
    			
    			cb(null, JSON.parse(output));
			}

		});
	});

	req.end();
}

module.exports = get;