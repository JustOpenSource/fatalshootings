Application to explore data from [Fatal Encounters](http://fatalencounters.org).

##Table of Contents

* [Setup](#setup)
	* [Install MongoDB](#install-mongodb)
	* [Start MongoDB](#start-mongodb)
 	* [Clone the Project](#clone-the-project)
 	* [Run Node Server](#run-node-server)
* [Application Architecture](#application-architecture)
* [API](#api)
 	* [Database Access](#database-access)
 		* [mongodb()](#mongodb)
 		* [req._db](#req_db)
 	* [Routes](#routes)
 	* [Views](#views)
  		* [Template](#template)
  		* [Model](#model)
  			* [export model function](#export-model-function)
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

###Clone the Project and install dependencies.

```
$ git clone https://github.com/JustOpenSource/fatalshootings.git
$ cd fatalshootings
$ npm install
```

###Import Sample Data

```
$ cd sys-admin
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
$ supervisor bin/www
```

Browse to [localhost:3000/list/](localhost:3000/list/).

##Application Architecture

###Database

The database, so far, is a single mongo collection. Each record is based off of the [entry schema](https://github.com/JustOpenSource/fatalshootings/blob/master/shared-utils/schemas/entry.json).

###Shared Components

Root directories prefixed with "shared-" are accessible by all apps.

The shared-config/constants.js file should be included in every file to access constant values and the logger function. 

###Applications

Explore and Admin are independent express applications and run on separate ports. 

Routes are managed via express. The route roots are defined within bin/www and the route files are in app/routes. 

Get and Post url end points requests are handled in app/routes.

Views are in /shared-views and contain mustache templates paired with JavaScript model functions that passes a data object to the template.

A node JS API lets you use the views. 

###Accessibility

All basic functionality must work without JavaScript. 

All pages must be responsive and support mobile, tablet, and desktop. 

All UI control strings must be internationalizable. 

###Explore Application

Public facing data explorer. 

####List

List of all records.

* Search by Name
* Filter by Cause, Sex, Race, Country, State, City, Zip, Coordinates + Range, Date Range.
* list of records
* Pagination

####Entry

An individual record's complete details.

###Admin Applicarion

###Sys Admin

Set of utilities and datasets used by engineers in thdevelopment and maintenance of he applications. 

##API

###Database Access

####mongodb()

To access the mongo db from outside of a running application, you can use the mongo-db utility.  This can be used for utilities that are meant to be run outside of the express application.  For database access within the application, see [req._db](#req_db)

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
```

####req._db

From within a route request, you can access database collections with the `_db` property on `req`. For an example, see [Routes](#routes). 

The collection is a [node mongodb](https://github.com/mongodb/node-mongodb-native) collection.  

###Routes

Routes are handled by express [router.route()](http://expressjs.com/api.html#router).

```
router.route('/').get(function(req, res){
	var collection = req._db.fatalities;
});
```

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

##Logging

For logging, we are using [winston](https://github.com/winstonjs/winston). 

To use the logger, include constants and then use `getLog()`.

###getLog()

```
var c = require('shared-config/constants');

/**
 * getLog
 * @param location {string} the location that the logger is being used
 * @returns log {function} returns wrapped log function
 */
var log = c.getLog('shared-utils/mongo-db');
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

Database GUI - [mongohub](http://mongohub.todayclose.com/download), [list of mongo guis](http://docs.mongodb.org/ecosystem/tools/administration-interfaces/)

App Framework - [node express](http://expressjs.com/4x/api.html)

Templates - [mustache](https://github.com/janl/mustache.js)

Logging - [winston](https://github.com/winstonjs/winston)

Promises - [q](https://github.com/kriskowal/q)

Language File Names - [IETF](http://en.wikipedia.org/wiki/IETF_language_tag)

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

Coming Soon.
