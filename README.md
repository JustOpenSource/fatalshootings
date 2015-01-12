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

	$ node couch_test.js
	
Go to `localhost:5984/_utils/`
