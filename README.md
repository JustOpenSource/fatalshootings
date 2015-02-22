Sandbox to explore data from [Fatal Encounters](fatalencounters.org)

#Setup#

Install [node](http://nodejs.org/) and [mongodb](http://www.mongodb.org/downloads). 

##Requirement Documentation##
[json-schema](http://json-schema.org/)

[jsonschema node module](https://www.npmjs.com/package/jsonschema)

[mongo db node api](https://github.com/mongodb/node-mongodb-native)

[mongo db](http://docs.mongodb.org/manual/)

[node express](http://expressjs.com/4x/api.html)

##Install and Start MongoDB##

Install it and added the bin to your paths.  Confirm that it worked by running:

```
$ mongo
```

Create a directory called `data` and then inside that put a directory named `db`.

mac:
```
$ mkdir /data/db
```

windows:
```
$ md /data/db
```

Start the database.

```
$ mongod --dbpath=/data --port 27017
```

Everytime you want to run the application locally, you will need to restart the mongo database.

##Import Sample Data##

```
$ cd sys-admin
$ npm install
$ node import-sample-data.js
```

##Run Node Server##

For ease of development, install `supervisor` to watch your files and automatically bounce the server.

	$ npm i supervisor -g

Pull the package and run the server.

	$ git clone https://github.com/JustOpenSource/fatalshootings.git
	$ cd fatalshootings/dashboard/explore
	$ npm install

	$ supervisor bin/www

Go to `localhost:3000/list/`

##API##

###Database Access###

To access the mongo db, you can use the mongo-db utility.
 
```
var mongodb = require(__base + 'shared-utils/mongo-db');
mongodb('database-name', function(err, db, close){
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
	});
	
	close();
});
```

###Routes and Views###

Routes are handles through express, but there are rendering utilities avialable that provides access to view/model processor pairs.  To create a new view with a model processory, create an html and js file with the same name in the `shared-utils` directory.

```
touch shared-views/view-name.html
touch shared-views/view-name.js
```

The html file is a mustache template, while the .js file is a model data processory.  There are two ways to write data model processors, either synchronously or asynchronously.  

####synchronous model processor####
```
function getModel(d){

	//processed data object in the format that the html template expects
	var data = {};
	
	return data;
}

module.exports = getModel;
```

####asynchronous model processor####
```
function getModel(d, cb){

	//processed data object in the format that the html template expects
	var data = {};
	
	//if you are making any requests, you can pass the error as the first param (or leave null)
	//and then pass the processed data as the second param
	cb(err, data);
}

module.exports = getModel;
```
 
####renderComponent()####

Rendering a component will fetch the template, apply the data model (and the accompanying data model processor), and call res.render().

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
	
	renderComponent(req, res, 'view-name', data, locals);

});
```

####getComponent()####

To get a template without calling `res.render()`, you can use `getComponent()`. You can use this method on synchronous or asynchronous model data processors.

getComponet, when used synchronously, will return:

```
{
	html: rendered data plus template,
	data: data,
	template: template html
}
```

```
// SYNCHRONOUSE USAGE
var testTemplate = getComponent('view-name', data);

// ASYNCHRONOUSE USAGE
getComponent('view-name', data, function(err, template){
	console.log(template);
});
```
