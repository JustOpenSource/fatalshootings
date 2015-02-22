var __base = __base || '../',
    c = require(__base + 'shared-config/constants'),
	getView = require('./get-view');

function renderView (req, res, component, data, locals) {

	getView(component, data, function(err, view){

		if(err){

			c.l('ERROR: could not get view', err);

			res.render('view', { 
        		'view' : "error"
    		});
		
		}


		c.l('SUCCESS: got view, calling res.render()');
		
		//adding blank space before express server output begins
		c.l(' ');
		
		res.render('view', {
        	'view' : view.html,
        	'locals' : locals
    	});

	});

}

module.exports = renderView;