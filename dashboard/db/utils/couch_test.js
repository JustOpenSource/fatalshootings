var _ = require('underscore'),
	nano = require('nano')('http://localhost:5984'),
	data = require('../sample_data/pfdata.js'),
	pfdb = nano.use('pf');

_.each(data, function(item, i){
	delete item._dmair;
	addRecords(item, i);
});

function addRecords(item, i){
	pfdb.insert(item, 'fatality_' + i,  function(err, body, header) {
		if (err) {
			console.log('[pf.insert] ', err.message);
			return;
		}

		console.log('you have inserted the rabbit.')
		console.log(body);
    });
}

/*
addRecords();
*/

/*
nano.db.create('pf', function(err, body) {
  if (!err) {
    console.log('database alice created!');

    pfdb = nano.use('pf');
    addRecords();
  } else {
  	console.log(err);
  }
});
*/


var testObject = {
	'foo' : 'bar'
};

module.exports = testObject;
