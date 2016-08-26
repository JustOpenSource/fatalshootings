#ATTENTION
This code is a shifting work in progress and is not stable.   

Application to explore data from [Fatal Encounters](http://fatalencounters.org).

The project has recently moved onto heroku and requires updated onboarding instructions.

##Table of Contents

* [Setup](#setup)
	* TODO
* [Application Architecture](#application-architecture)
* [API](#api)
 	* [Routes](#routes)
 	* [Views](#views)
  		* [Template](#template)
  		* [Model](#model)
  			* [export model function](#export-model-function)
  		* [Using Views](#using-views)
  		 	* [getView()](#getview)
  			* [renderView()](#renderview)



##Application Architecture

###Accessibility

All basic functionality must work without JavaScript. 

All pages must be responsive and support mobile, tablet, and desktop with as similar as an experience/workflow as possible. 

All UI control strings and enum values must be internationalizable. 

##API

###Views

**Note**: Currently the view utilities only work with views in `/shared-views`.

Views are template/model pairs.  The template provides the markup and the model returns a data object in the format expected by the template.

To create a new template/model, create an html and a js file with the same name in `/shared-views`.

```
touch shared-views/view-name.html
touch shared-views/view-name.js
```

####Template
The html file is a [mustache template](https://github.com/janl/mustache.js).

####Model
The js file `module.exports` a function called `getModel` that returns a json object in the format that the html template expects. 

#####export model function()

There are two ways to write models, either synchronously or asynchronously.  

######synchronous
```
/**
 * export model
 * @param d {object} the data passed into the model
 * @returns data {object} the processed data object in the format expected by the template
 */
module.exports = function(d){

	//processed data object in the format that the html template expects
	return {};
};
```

######asynchronous
```
/**
 * export model
 * @param d {object} the data passed into the model 
 * @param cb {function} a function to runs once the data is available
 */
module.exports = function(d, cb){

	//processed data object in the format that the html template expects
	var data = {};
	
	/**
	 * cb
	 * @param err {string || null}  error message or null
	 * @param data {object} data object expected by the html template
	 */
	cb(err, data);
}
;
```

####Using Views

#####getView()

To get a view, use the `getView()` utility. You can use this method on synchronous or asynchronous models.

```
var getView = require('shared-utils/get-view');

/**
 * getView
 * SYNCHRONOUSE USAGE
 * @param template {string} name of template/model pair
 * @param data {object} data being passed into the model
 * @returns view {object} {
 *	html {string} rendered template after applying data
 *	data {object} data
 *	template {string} template html before applying data
 * }
 */
var myView = getView('view-name', data);

/**
 * getView
 * ASYNCHRONOUSE USAGE
 * @param template {string} name of template/model pair
 * @param data {object} data being passed into the model
 * @param cb {function}
 */
getView('view-name', data, cb);

/**
 * cb
 * @param err {object} error message or null
 * @param view {object} {
 *	html {string} rendered template after applying data
 *	data {object} data
 *	template {string} template html before applying data
 * }
 */
function cb(err, view){
	console.log(view);
}
```

#####renderView()

The `renderView()` is used inside the route callback and expects the `req` and `res` objects.

Rendering a view with this utility will fetch the template, apply the data model, and call `res.render()` to render the view inside of the global html page template.

```
var express = require('express'),
    router = express.Router(),
    renderView = require('shared-utils/render-view');

router.route('/').get(function(req, res){

	//data that you will pass to the model
	var data = {};
	
	//local variables are processed by the html page template
	var locals = {
	
		//title of the html document
		title: 'Title of HTML Page',
		
		//require js config file to include on the page
		js: ['config/list'],
		
		//css files to include on the page
		css: ['list']
	}
	
	/**
	 * renderView
	 * @param req {object} node express request object
	 * @param res {object} node express response object
	 * @param template {string} name of template/model pair
	 * @param data {object} data being passed into model
	 * @param locals {object} local variables object to pass to wrapper template
	 */
	renderView(req, res, 'view-name', data, locals);
});
```

##Features

###List

List of entries.

[http://localhost:3000/list](http://localhost:3000/list)

[template](https://github.com/JustOpenSource/fatalshootings/blob/master/shared-views/fatality-list.html) | [model](https://github.com/JustOpenSource/fatalshootings/blob/master/shared-views/fatality-list.js)

####Filters

Filters that limit the list, controlled by url query paramters.

Currently supports: name, race, cause, sex, state

http://localhost:3000/list?race=African-American/Black&cause=gunshot&sex=male&state=CT

[template](https://github.com/JustOpenSource/fatalshootings/blob/master/shared-views/fatality-list-filter.html) | [model](https://github.com/JustOpenSource/fatalshootings/blob/master/shared-views/fatality-list-filter.js)

####Pagination

Pagination is controlled with the url query parameters `limit` (entries per page) and `page` (current page number).

[http://localhost:3000/list?limit=10&page=3](http://localhost:3000/list?limit=10&page=3)

[template](https://github.com/JustOpenSource/fatalshootings/blob/master/shared-views/components/pagination.html) | [model](https://github.com/JustOpenSource/fatalshootings/blob/master/shared-views/components/pagination.js)

####Responsiveness

Controlled via boostrap.

####Sort

TODO
