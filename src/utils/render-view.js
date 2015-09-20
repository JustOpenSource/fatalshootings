var __base = __base || '../';
var c = require(__base + 'constants');
var log = c.getLog('utils/render-view');
var getView = require(__base + 'utils/get-view');
var _ = require('underscore');

function getNav(req, user){
	
	log('trace', 'getNav');

	//TODO: This probably isn't necessary, or at least shouldn't be
	var nav_str = require(__base + 'lang/nav/' + req.lang);

	return getView(req.lang, 'nav', { 
	
		'user' : user,
		'_str' : nav_str

	});
}

function renderView (req, res, component, data, locals) {

	req.lang = req.lang || 'en';
	data._db = req._db;

	try {

		data._str = require(__base + 'lang/' + component + '/' + req.lang);
	
	} catch (e){
	
		data._str = {};
	
	}

	data.locals = req.app.locals;

	var user = req.session && req.session.user ? req.session.user : null;
	
	data._str._lang = req.lang;

	//make renderView available to all sub views
	data.renderView = function(template, d, cb){
		
		d.renderView = data.renderView;

		if(cb){

			getView(req.lang, template, d, cb);

		} else {

			return getView(req.lang, template, d);

		}
	}

	var nav = getNav(req, user);

	getView(req.lang, component, data, function( err, view ){

		if(err){

			log('error', 'could not get view', err);

			res.render('view', { 
        		'view' : "error"
    		});
		}

		locals._str = data._str;

		log('trace', 'got view, calling res.render()');
		
		res.render('view', {
			'nav' : nav,
        	'view' : view,
        	'locals' : locals
    	});
	});
}

module.exports = renderView;