var __base = __base || '../',
    c = require(__base + 'shared-config/constants'),
    log = c.getLog('shared-utils/render-view'),

	getView = require('./get-view');

function renderView (req, res, component, data, locals) {

	data._db = req._db;

	try {

		data._str = require(__base + 'lang/' + component + '/' + req.lang);
	
	} catch (e){
	
		data._str = {};
	
	}

	data._str._lang = req.lang;

	getView(req.lang, component, data, function(err, view) {

		if(err){

			log('error', 'could not get view', err);

			res.render('view', { 
        		'view' : "error"
    		});
		
		}


		log('trace', 'got view, calling res.render()');
		
		res.render('view', {
        	'view' : view.html,
        	'locals' : locals
    	});
	});
}

module.exports = renderView;