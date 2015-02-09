==Install MongoDB==

===Windows Instructions===

http://www.mongodb.org/downloads

It is 133 MB and the download was pretty slow, so it took a while for me.

Installed it and then added the bin to my paths.  Confirmed that it worked by running

 $ mongo

You will need to create a directory where the db will live. 

Create a directory called data and then inside that put a directory named db.

 $ md /data/db

Now, run your database.

 $ mongod --dbpath=/data --port 27017

You will need to start up this database listener to develop.

To verify that it the app will connect properly, you can run:

 $ node db/utils/_mongo-test.js