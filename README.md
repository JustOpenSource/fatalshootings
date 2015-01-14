Sandbox to explore data from [Fatal Encounters](fatalencounters.org)

#Setup#

##Play with d3##

Install [node](http://nodejs.org/) and [couchdb](http://couchdb.apache.org/).  

	$ git clone https://github.com/JustOpenSource/fatalshootings.git
	$ cd fatalshootings/dashboard
	$ npm install

	$ node bin/www

Go to `localhost:3000`
	
##Play with couchdb##

You do not need node to interface with the database, but the application interfaces will be built in node (and currently, node is needed to push the sample json into the database.  

If you only need to pull from the database, you can grab the json from the data file (see below) and insert it yourself.  Then, you can manage all of the database views via the couch web utility.

	$ node db/utils/couch_test.js
	
Go to `localhost:5984/_utils/` for the couch db management tool.

##Sample Data##

There is a module in `db/sample_data/pfdata.js` that contains a stale dataset ready for import into a couch database.

##Requirement Documentation##
[json-schema](http://json-schema.org/)
[jsonschema node module](https://www.npmjs.com/package/jsonschema)
[nano](https://github.com/dscape/nano)
