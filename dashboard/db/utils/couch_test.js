var _ = require('underscore'),
	nano = require('nano')('http://localhost:5984'),
	data = require('../sample_data/pfdata.js'),
	pfdb = nano.use('pf');
/*
//loop over each record to adjust data
_.each(data, function(item, i){
	delete item._dmair;
	addRecords(item, i);
});

//add the record set to a database
function addRecords(item, i){
	pfdb.insert(item, 'fatality_' + i,  function(err, body, header) {
		if (err) {
			console.log('[pf.insert] ', err.message);
			return;
		}
    });
}
*/
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

/*
var testObject = {
	'foo' : 'bar'
};

module.exports = testObject;
*/