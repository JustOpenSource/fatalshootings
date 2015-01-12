Sandbox to explore data from [Fatal Encounters](fatalencounters.org)

#Setup#

First, install [node](http://nodejs.org/) and [couchdb](http://couchdb.apache.org/).  

	$ git clone https://github.com/JustOpenSource/fatalshootings.git
	$ cd fatalshootings/dashboard
	$ npm install

##Play with d3##

	$ node bin/www

Go to `localhost:3000`
	
##Play with couchdb##

	$ node db/utils/couch_test.js
	
Go to `localhost:5984/_utils/` for the couch db management tool.

There is a module in `db/sample_data/pfdata.js` that contains a stale dataset ready for import into a couch database.
