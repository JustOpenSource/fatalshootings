Sandbox to explore data from [Fatal Encounters](fatalencounters.org)

#Setup#

##Play with d3##

Install [node](http://nodejs.org/) and [couchdb](http://couchdb.apache.org/).  

For ease of development, install `supervisor` to watch your files and automatically bounce the server.

	$ npm i supervisor -g

Then, you can pull the package and run the server.

	$ git clone https://github.com/JustOpenSource/fatalshootings.git
	$ cd fatalshootings/dashboard
	$ npm install

	$ supervisor bin/www

Go to `localhost:3000`
	
When using `supervisor` instead of `node`, the server will automatically bounce when you save files.

##Play with couchdb##

The database is built using (couchdb)[http://couchdb.apache.org/] you will need to download and install it before working with the data. Once installed and running, the management tool is located at (localhost:5984/_utils/)[http://localhost:5984/_utils/]

If you only need to pull from the database, you can grab the json from the data file (see below) and insert it yourself. You will need to manually manage all of the database views via the couch management tool

You do not need node to interface with the database, but the application interfaces will be built in node (and currently, node is needed to push the sample json into the database.)  

###Installing Data###

After you have installed node, couch, this package, and started up the application, you can install the data by visiting (localhost:3000/install/)[localhost:3000/install/].

##Requirement Documentation##
[json-schema](http://json-schema.org/)

[jsonschema node module](https://www.npmjs.com/package/jsonschema)

[nano](https://github.com/dscape/nano)
