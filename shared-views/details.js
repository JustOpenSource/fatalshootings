var __base = __base || '../',
    c = require(__base + 'shared-config/constants'),
    log = c.getLog('shared-views/details'),

    _ = require('underscore'),

    httpGet = require(__base + 'shared-utils/http-get');

function getDetails(id, cb) {

    log('trace', 'attempt to get details: ' + id);

    /**/
    httpGet(c.url.details + id, cb);
	/**/
}

function formatDetails(details){

  	function pushValues(values){
  		var list = [];

  		_.each(values, function(value){
  			list.push({
  				'key' : value[0],
  				'value' : value[1]
  			})
  		});

  		return list;
  	}

  	var subject = [
  		['name', details.value.subject.name],
  		['age', details.value.subject.age],
  		['sex', details.value.subject.sex],
  		['race', details.value.subject.race],
  		['mentall illness', details.value.subject.mental_illness]
  	];

  	var death = [
  		['cause', details.value.death.cause],
  		['notes', details.value.location.death],
  		['agency', details.value.death.responsible_agency],
  		['description', details.value.death.description],
  		['disposition', details.value.death.disposition],
  		['date', details.value.death.event.date]
  	];

  	var location = [
  		['country', details.value.location.country || 'us'],
  		['city', details.value.location.city],
  		['state', details.value.location.county],
  		['zip', details.value.location.zip]
  	];

  	return [{
  		'sectionTitle' : 'Subject',
  		'values' :  pushValues(subject)
  	}, {
  		'sectionTitle' : 'Death',
  		'values' :  pushValues(death)
  	}, {
  		'sectionTitle' : 'Location',
  		'values' :  pushValues(location)
  	}]
}

module.exports = function(d, cb) {

	getDetails(d.id, function(err, body){
		if(err){
			log('error', 'get details error', err);

			//cb(err)
		}

		log('trace', 'get details', body);

		cb(null, {
			'sections' : formatDetails(body)
		});
	});
}