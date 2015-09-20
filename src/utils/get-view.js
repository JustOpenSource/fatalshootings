var __base = __base || '../';
var c = require(__base + 'constants');
var log = c.getLog('utils/get-view');
var fs = require('fs');
var mustache = require('mustache');

var PATH_TO_TEMPLATES = __dirname + '/' + __base + 'views/';
var TEMPLATE_EXT = '.html';
var DEFAULT_LANG = 'en';

function getStrings(template){

	var str = {};

	var lang = lang || DEFAULT_LANG;

	try {

		log('trace', 'get lang: ' + template);

		str = require(__base + 'lang/' + template + '/' + lang);

	} catch (err) {

		log('error', 'could not get lang: ' + template);
	
	}

	str._lang = lang;

	return str;
}

function getTemplate(template, viewPath){

	var templateFile = viewPath + TEMPLATE_EXT;
	var html;

	try {

		log('trace', 'attempt to retrieve ' + template + ' view template');

		html = fs.readFileSync(templateFile).toString();
	
	} catch (err) {

		log('error', 'could not retrieve ' + template + ' view template', err);

	}

	return html;
}

function getModel(template, viewPath){

	var model;

	try {

		log('trace', 'attempt to retrieve async view model ' + template);

		model = require(viewPath);
	
	} catch(err){
		
		log('error', 'require() failed, async view model ' + template + ' contains errors', err);
	
	}

	return model;
}

function syncModel(template, model, data, html, cb){
	var data = model(data);

	var returnValue = {
		html: mustache.render(html, data),
		data: data,
		template: html
	};

	//even if the view is sync, allow it to be called with a callback
	if(cb){

		cb(null, returnValue);
	
	} else {
		
		return returnValue;
	
	}
}

function asyncModel(template, model, data, html, cb){

	model(data, function(err, d){

		if(err){

			log('error', 'async view model ' + template + ' returned error', err);

			cb(err);
		}

		d._str = data._str;

		cb(null, {
			html: mustache.render(html, d),
			data: d,
			template: html
		});
	});

}

//TODO: Too Deeply Nested
function getView (lang, template, data, cb) {

	var viewPath = PATH_TO_TEMPLATES + template;

	var html = getTemplate(template, viewPath);

	var model = getModel(template, viewPath);

	data._str = getStrings(template);

	//sync model
	if(model.length === 1){

		return syncModel(template, model, data, html, cb);

	//async model
	} else if(model.length === 2){

		asyncModel(template, model, data, html, cb);
		
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