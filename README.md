#Table of Contents

* [Setup](#setup)
	* [Install MongoDB](#install-mongodb)
	* [Start MongoDB](#start-mongodb)
 	* [Clone the Project](#clone-the-project)
 	* [Run Node Server](#run-node-server)
* [API](#api)
 	* [Database Access](#database-access)
 		* [mongo-db](#mong-db)
 	* [Routes](#routes)
 	* [Views](#views)
  		* [Template](#template)
  		* [Model](#model)
  			* [getModel()](#getmodel)
  		* [Using Views](#usingviews())
  		 	* [getComponent()](#getcomponent)
  			* [renderComponent()](#rendercomponent)
* [Requirements Documentation](#requirements-documentation)

Explore data from [Fatal Encounters](http://fatalencounters.org).

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

####mongo-db

To access the mongo db, you can use the mongo-db utility.

```
var mongodb = require(__base + 'shared-utils/mongo-db');

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

To create a new template/model, create an html and a js file with the same name in `/shared-utils`.

```
touch shared-views/view-name.html
touch shared-views/view-name.js
```

####Template
The html file is a [mustache template](https://github.com/janl/mustache.js).

####Model
The js file is the model and returns a json object in the format that the html template expects. 

#####getModel()

There are two ways to write models, either synchronously or asynchronously.  

######synchronous
```
/**
 * getModel
 * @param d {object} the data passed into the model 
 */
function getModel(d){

	//processed data object in the format that the html template expects
	return {};
}

module.exports = getModel;
```

#####asynchronous
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

#####getComponent()

To get a template without calling `res.render()`, you can use `getComponent()`. You can use this method on synchronous or asynchronous models.

```
/**
 * getComponent
 * SYNCHRONOUSE USAGE
 * @param template {string} name of template/model pair
 * @param data {object} data being passed into the model
 * @returns view {object} {
 *	html {string} rendered template after applying data
 *	data {object} data
 *	template {string} template html before applying data
 * }
 */
var myView = getComponent('view-name', data);

/**
 * getComponent
 * ASYNCHRONOUSE USAGE
 * @param template {string} name of template/model pair
 * @param data {object} data being passed into the model
 * @param cb {function}
 */
getComponent('view-name', data, cb);

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

#####renderComponent()

Rendering a component will fetch the template, apply the data model, and call res.render().

```
router.route('/').get(function(req, res){

	//data that you will pass to the model processor
	var data = {};
	
	//local variables are processed by the page template
	var locals = {
	
		//title of the html document
		title: PAGE_TITLE,
		
		//require js config file to include on the page
		js: ['config/list'],
		
		//css files to include on the page
		css: ['list']
	
	}
	
	/**
	 * renderComponent
	 * Note that the return only applies when there is no callback
	 * @param req {object} node express request object
	 * @param res {object} node express response object
	 * @param template {string} name of template/model pair
	 * @param data {object} data being passed into model
	 * @param locals {object} local variables object to pass to wrapper template
	 */
	renderComponent(req, res, 'view-name', data, locals);

});
```

##Requirement Documentation##
[json-schema](http://json-schema.org/)

[jsonschema node module](https://www.npmjs.com/package/jsonschema)

[mongo db node api](https://github.com/mongodb/node-mongodb-native)

[mongo db](http://docs.mongodb.org/manual/)

[node express](http://expressjs.com/4x/api.html)

[mustache](https://github.com/janl/mustache.js)
