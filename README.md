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

The database is built using (couchdb)[http://couchdb.apache.org/] you will need to download and install it before working with the data. Once installed and running, the management tool is located at (localhost:5984/_utils/)[http://localhost:5984/_utils/]

If you only need to pull from the database, you can grab the json from the data file (see below) and insert it yourself. You will need to manually manage all of the database views via the couch management tool

You do not need node to interface with the database, but the application interfaces will be built in node (and currently, node is needed to push the sample json into the database.)  

###Installing Data - Node###

If you are using node to install the data, you will first need to manually create the `pf` table in the couch db management tool. You can then run the following command to import the data

	$ node db/utils/couch_test.js
	
###Installing Data - Manual###

There is a module in `db/sample_data/pfdata.js` that contains a stale dataset ready for import into a couch database.

##Requirement Documentation##
[json-schema](http://json-schema.org/)

[jsonschema node module](https://www.npmjs.com/package/jsonschema)

[nano](https://github.com/dscape/nano)
