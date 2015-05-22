var __base = __base || '../',
    c = require(__base + 'shared-config/constants'),
    log = c.getLog('shared-utils/get-view'),

    fs = require('fs'),
    mustache = require('mustache'),
    
    PATH_TO_TEMPLATES = __dirname + '/../shared-views/',
    TEMPLATE_EXT = '.html';

function getView (lang, template, data, cb) {

	var viewPath = PATH_TO_TEMPLATES + template,
		templateFile = viewPath + TEMPLATE_EXT,
		html;

	lang = lang || 'en';

	try {

		log('trace', 'get lang: ' + template);

		data._str = require(__base + 'lang/' + template + '/' + lang);

	} catch (err) {

		log('error', 'could not get lang: ' + template);
	
		data._str = {};
	
	}

	data._str._lang = lang;

	try {

		var templateFile = viewPath + TEMPLATE_EXT;

		log('trace', 'attempt to retrieve ' + template + ' view template');

		html = fs.readFileSync(templateFile).toString();

		//foo

		log('trace', 'retrieved ' + template + ' view template');
	
	} catch (err) {

		log('error', 'could not retrieve ' + template + ' view template');

	}



	if(cb){

		try {

			log('trace', 'attempt to retrieve async view model ' + template);

	    	require(viewPath)(data, function(err, d){

	    		if(err){

	    			log('error', 'async view model ' + viewPath + ' returned error', err);

	    			cb(err);
	    		}

	    		log('trace', 'retrieved async view model, calling cb() and passing in view object ' + template);

	    		d._str = data._str;

	    		cb(err, {
					html: mustache.render(html, d),
					data: d,
					template: html
				});

				return;

	    	});

	    } catch (err) {
	    	log('error', 'require() failed, async view model ' + template + ' contains errors');
	    	cb(err);
	    }

	} else {

		try {

			log('trace', 'attempt to retrieve sync view model ' + template);

			data = require(viewPath)(data);

			log('trace', 'retrieved sync view model ' + template + ', returning model data');

			return {
				html: mustache.render(html, data),
				data: data,
				template: html
			}

		} catch (err) {

			log('error', 'require() failed, sync view model ' + template + ' contains errors');
		
			return;
		}

	}

};

/*/ SYNCHRONOUSE USAGE

var testView = getView('components/pagination', {
	total: 50,
	current: 32
});

//log('trace', 'testView pagination', testView);

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