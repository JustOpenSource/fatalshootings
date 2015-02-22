var __base = __base || '../',
    c = require(__base + 'shared-config/constants'),
	getView = require('./get-view');

function renderView (req, res, component, data, locals) {

	getView(component, data, function(err, view){

		if(err){

			res.render('view', { 
        		'view' : "error"
    		});
		
		}
		
		res.render('view', { 
        	'view' : view.html,
        	'locals' : locals
    	});

	});

}

module.exports = renderView;