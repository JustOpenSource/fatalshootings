var __base = __base || '../../',
    c = require(__base + 'config/constants'),
    get = require(__base + 'db/utils/get')

module.exports = function(cb){
	
	var url = 'http://localhost:5984/pfc/_design/counts/_view/age?group=true';

	get(url, function(status, d){

		if (status){
		
			c.l('error: failed to resolve request to "' + attr + '"');
		
		} else {

			var data = {
				'payload' : d
			}
		
			c.l('success: no status on http request')
			cb(data);
		
		}

	});
}