var __base = __base || '../',
    c = require(__base + 'shared-config/constants'),
    fs = require('fs'),
    mustache = require('mustache');

function getComponent (template, data, cb) {

	var componentPath = __dirname + '/../shared-views/',
		html = fs.readFileSync(componentPath + template + '.html').toString(),
		renderedTemplate;

	try { 

	    require(componentPath + template)(data, function(err, data){

	    	c.l('data', data);

	    	cb(err, {
				html: mustache.render(html, data),
				data: data,
				template: html
			});

	    });
		
	    if (cb) { return; }

	} catch (err) {

		c.l('err', err);
		
		return {
			'error' : 'template not found'
		}
	}

	return {
		html: mustache.render(html, data),
		data: data,
		template: html
	}

};

/*/ SYNCHRONOUSE USAGE

var testTemplate = getComponent('components/pagination', {
	total: 50,
	current: 32
})

c.l('testTemplate', testTemplate)

/**/

/*/ ASYNCHRONOUSE USAGE

getComponent(component, data, function(err, template){

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

module.exports = getComponent;