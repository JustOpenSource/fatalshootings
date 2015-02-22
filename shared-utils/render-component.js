var __base = __base || '../',
    c = require(__base + 'shared-config/constants'),
	getComponent = require('./get-component');

function renderComponent(req, res, component, data, locals){

	getComponent(component, data, function(err, template){

		if(err){

			res.render('view', { 
        		'view' : "error"
    		});
		
		}
		
		res.render('view', { 
        	'view' : template.html,
        	'locals' : locals
    	});

	});

}

module.exports = renderComponent;