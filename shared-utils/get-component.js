var __base = __base || '../',
    c = require(__base + 'shared-config/constants'),
    fs = require('fs'),
    mustache = require('mustache');

function getComponent (template, data) {

	var componentPath = __dirname + '/../shared-views/components/',
		html = fs.readFileSync(componentPath + template + '.html').toString(),
		renderedTemplate;

	try {

	    data = require(componentPath + template)(data);
	
	} catch (err) {}

	return mustache.render(html, data);

};

var testTemplate = getComponent('pagination', {
	total: 50,
	current: 32
});

c.l('testTemplate', testTemplate)

module.exports = getComponent;