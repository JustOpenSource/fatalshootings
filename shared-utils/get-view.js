var __base = __base || '../',
    c = require(__base + 'shared-config/constants'),
    fs = require('fs'),
    mustache = require('mustache'),
    PATH_TO_TEMPLATES = __dirname + '/../shared-views/';

function getView (template, data, cb) {

	
	var viewPath = PATH_TO_TEMPLATES + template,

		html;

	try {

		c.l('ATTEMPT: retrieve template ' + viewPath);

		html = fs.readFileSync(viewPath + '.html').toString();

		c.l('SUCCESS: retrieved template');
	
	} catch (err) {

		c.l('ERROR: could not retrieve template');

	}

	try {

		c.l('ATTEMPT: retrieve view model ' + viewPath);

		if(cb){

	    	require(viewPath)(data, function(err, data){

	    		c.l('SUCCESS: retrieved async view model, calling cb() and passing in view object');

	    		cb(err, {
					html: mustache.render(html, data),
					data: data,
					template: html
				});

	    	});


	    	return;

		} else {

			data = require(viewPath)(data);

			c.l('SUCCESS: retrieved view model');

		}

	} catch (err) {

		var errMsg = template + ' view model contains errors';

		c.l('ERROR: ' + errMsg);
		
		return false;
	}

	return {
		html: mustache.render(html, data),
		data: data,
		template: html
	}

};

/*/ SYNCHRONOUSE USAGE

var testView = getView('components/pagination', {
	total: 50,
	current: 32
});

c.l('testView', testView);

/**/

/*/ ASYNCHRONOUSE USAGE

getView(component, data, function(err, template){

	if(err){
		res.render('view', { 
    		'view' : "error"
		});
	}
	
	res.render('view', { 
    	'view' : template.html
	});

});

/**/

module.exports = getView;