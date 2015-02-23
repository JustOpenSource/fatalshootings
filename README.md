Application to explore data from [Fatal Encounters](http://fatalencounters.org).

##Table of Contents

* [Setup](#setup)
	* [Install MongoDB](#install-mongodb)
	* [Start MongoDB](#start-mongodb)
 	* [Clone the Project](#clone-the-project)
 	* [Run Node Server](#run-node-server)
* [API](#api)
 	* [Database Access](#database-access)
 		* [mongodb()](#mongodb)
 	* [Routes](#routes)
 	* [Views](#views)
  		* [Template](#template)
  		* [Model](#model)
  			* [getModel()](#getmodel)
  		* [Using Views](#using-views)
  		 	* [getView()](#getview)
  			* [renderView()](#renderview)
* [Logging](#logging) 
	* [getLog()](#getlog)
	* [log()](#log) 
	* [Log Levels](#log-levels)
	* [Log Output](#log-output)
* [Requirements Documentation](#requirements-documentation)
* [Features](#features)

##Setup

Install [node](http://nodejs.org/) and [mongodb](http://www.mongodb.org/downloads). 

###Install MongoDB

Install mongodb and add the bin to your paths.  Confirm that it worked by running:

```
$ mongo
```

Create a directory `data` and then inside that put a directory `db`.

mac:
```
$ mkdir /data/db
```

windows:
```
$ md /data/db
```

###Start MongoDB

Open a new terminal window and start the database.

```
$ mongod --dbpath=/data --port 27017
```

The database must be running to use the application.

###Clone the Project

```
$ git clone https://github.com/JustOpenSource/fatalshootings.git
$ cd fatalshootings
```

###Import Sample Data

```
$ cd sys-admin
$ npm install
$ node import-sample-data.js
```

###Run Node Server

For ease of development, install `supervisor` to watch your files and automatically bounce the server.

```
$ npm install supervisor -g
```

Go to the `explore` application, install node dependencies, and run the server.

```
$ cd explore
$ npm install
$ supervisor bin/www
```

Browse to [localhost:3000/list/](localhost:3000/list/).

##API

###Database Access

####mongodb()

To access the mongo db, you can use the mongo-db utility.

```
var mongodb = require('shared-utils/mongo-db');

/**
 * mongodb
 * @param databaseName {string} name of the mongo database to access
 * @param cb {function} callback for the mongo database connection
 */
mongodb('database-name', cb);

/**
 * cb
 * @param err {object} connection error or null
 * @param db {object} a mongo database instance
 * @param close {function} close function must be called after you get your data
 */
function cb(err, db, close){
	if(err){
		//handle error
	}
	
	db.collection('collection-name')
	.find({})
	.toArray(function(err, body){
	 
		if(err){
		 	//handle error
		}
	
		//do stuff with data
		
		//close the db connection once you have the data 
		close();
		
	});
}
```

###Routes

Routes are handled by express [router.route()](http://expressjs.com/api.html#router).

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

#####getModel()

There are two ways to write models, either synchronously or asynchronously.  

######synchronous
```
/**
 * getModel
 * @param d {object} the data passed into the model
 * @returns data {object} the processed data object in the format expected by the template
 */
function getModel(d){

	//processed data object in the format that the html template expects
	return {};
}

module.exports = getModel;
```

######asynchronous
```
/**
 * getModel
 * @param d {object} the data passed into the model 
 * @param cb {function} a function to runs once the data is available
 */
function getModel(d, cb){

	//processed data object in the format that the html template expects
	var data = {};
	
	/**
	 * cb
	 * @param err {string || null}  error message or null
	 * @param data {object} data object expected by the html template
	 */
	cb(err, data);
}

module.exports = getModel;
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

##Logging

For logging, we are using [winston](https://github.com/winstonjs/winston). 

To use the logger, include constants and then use `getLog()`.

###getLog()

```
var c = require('shared-config/constants');

/**
 * getLog
 * @param log {function} the log function from constants
 * @param location {string} the location that the logger is being used
 * @returns log {function} returned the log function
 */
var log = c.getLog(c.log, 'shared-utils/mongo-db');
```

###log()
```
/**
 * getLog
 * @param level {string} the level of the log (info, warn, error, ...)
 * @param message {string} the error message
 * @param data {object} a json data object with additional information
 */
log('error', 'something went wrong', err);
```

###Log Levels

The three logging levels are `trace`, `info`, and `error`.

###Log Output

Logs that are level `info` or `error` will output into the `/log` directory, while all levels will output to the console.

Logs in the `/log` directory are named `yyyymmdd.log`.

##Requirement Documentation
JSON Schema - [json-schema](http://json-schema.org/), [jsonschema node module](https://www.npmjs.com/package/jsonschema)

Database - [mongo db](http://docs.mongodb.org/manual/)

Database API - [mongo db node api](https://github.com/mongodb/node-mongodb-native)

App Framework - [node express](http://expressjs.com/4x/api.html)

Templates - [mustache](https://github.com/janl/mustache.js)

Logging - [winston](https://github.com/winstonjs/winston)

##Features

###List

List of entries.

[http://localhost:3000/list](http://localhost:3000/list)

[template](https://github.com/JustOpenSource/fatalshootings/blob/master/shared-views/fatality-list.html) | [model](https://github.com/JustOpenSource/fatalshootings/blob/master/shared-views/fatality-list.js)

####Filters

Filters that limit the list, controlled by url query paramters.

[template](https://github.com/JustOpenSource/fatalshootings/blob/master/shared-views/fatality-list-filter.html) | [model](https://github.com/JustOpenSource/fatalshootings/blob/master/shared-views/fatality-list-filter.js)

####Pagination

Pagination is controlled with the url query parameters `limit` (entries per page) and `page` (current page number).

[http://localhost:3000/list?limit=10&page=3](http://localhost:3000/list?limit=10&page=3)

[template](https://github.com/JustOpenSource/fatalshootings/blob/master/shared-views/components/pagination.html) | [model](https://github.com/JustOpenSource/fatalshootings/blob/master/shared-views/components/pagination.js)

####Responsiveness

Controlled via boostrap.

####Sort

Coming Soon.
