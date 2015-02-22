Sandbox to explore data from [Fatal Encounters](fatalencounters.org)

#Setup#

##Run Node Server##

Install [node](http://nodejs.org/) and [couchdb](http://couchdb.apache.org/).  

For ease of development, install `supervisor` to watch your files and automatically bounce the server.

	$ npm i supervisor -g

Then, you can pull the package and run the server.

	$ git clone https://github.com/JustOpenSource/fatalshootings.git
	$ cd fatalshootings/dashboard
	$ npm install

	$ supervisor explore/bin/www

Go to `localhost:3000/list/`
	
When using `supervisor` instead of `node`, the server will automatically bounce when you save files.

##Requirement Documentation##
[json-schema](http://json-schema.org/)

[jsonschema node module](https://www.npmjs.com/package/jsonschema)


##APPLICATION ARCHITECTURE##

###Accessing Database###

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

 touch shared-views/view-name.html
 touch shared-views/view-name.js

 
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

To get a template without calling `res.render()`, you can use `getComponent()`. You can use this method synchronously or asynchronously.

```
// SYNCHRONOUSE USAGE
var testTemplate = getComponent('view-name', data)

// ASYNCHRONOUSE USAGE
getComponent('view-name', data, function(err, template){
	console.log(template);
});
```

#DEPRECIATED#

##Play with couchdb##

The database is built using (couchdb)[http://couchdb.apache.org/] you will need to download and install it before working with the data. Once installed and running, the management tool is located at (localhost:5984/_utils/)[http://localhost:5984/_utils/]

If you only need to pull from the database, you can grab the json from the data file (see below) and insert it yourself. You will need to manually manage all of the database views via the couch management tool

You do not need node to interface with the database, but the application interfaces will be built in node (and currently, node is needed to push the sample json into the database.)  

###Installing Data###

After you have installed node, couch, this package, and started up the application, you can install the data by visiting (localhost:3000/install/)[localhost:3000/install/].

##Requirement Documentation##

[nano](https://github.com/dscape/nano)

#Stats#

supported properties: age, cause, sex, race, state

http://localhost:5984/pfc/_design/counts/_view/[property]?group=true

#Meta Data Database#

Add files to `/db/meta_docs/` to create metadata documents.  

To add meta_docs to database named `pfc_meta` (and create db if it doesn't exist)

	node /dashboard/db/utils/create_meta_docs.js
 
