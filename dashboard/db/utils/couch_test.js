var _ = require('underscore'),
	nano = require('nano')('http://localhost:5984'),
	data = require('../sample_data/pfcdata.js');
	testvar = 'k',
	pfdb = null;

//add the record set to a database
function addRecords(){
	_.each(data.rows, function(item, i){
		pfdb.insert(item, item.id, function(err, body, header) {
			console.log('[pf' + testvar + '.insert] ' + item.id);
				
			if (err) {
				console.log('[pf' + testvar + '.insert] ', err.message);
				return;
			}
	    });
	});
}

nano.db.create('pf' + testvar, function(err, body) {
	if (!err) {
		console.log(body);
		//console.log('database pf' + testvar + ' created!');
		//pfdb = nano.use('pf' + testvar);
		//addRecords();
	} else {
		console.log(err);
	}
});