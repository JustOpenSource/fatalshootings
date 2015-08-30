var __base = __base || '../',
    c = require(__base + 'shared-config/constants'),
    log = c.getLog('shared-utils/render-view'),

	getView = require('./get-view');

function renderView (req, res, component, data, locals) {

	req.lang = req.lang || 'en';
	data._db = req._db;

	try {

		data._str = require(__base + 'lang/' + component + '/' + req.lang);
	
	} catch (e){
	
		data._str = {};
	
	}

	data.locals = req.app.locals;

	data._str._lang = req.lang;

	function getNav(cb){
		var nav_str = require(__base + 'lang/nav/' + req.lang);

		getView(req.lang, 'nav', { '_str' : nav_str }, function(err, nav) {
			cb(nav);
		});
	}

	getNav(function(nav){
		getView(req.lang, component, data, function(err, view) {

			if(err){

				log('error', 'could not get view', err);

				res.render('view', { 
	        		'view' : "error"
	    		});
			}

			locals._str = data._str;

			log('trace', 'got view, calling res.render()');
			
			res.render('view', {
				'nav' : nav.html,
	        	'view' : view.html,
	        	'locals' : locals
	    	});

		});
	});
}

module.exports = renderView;