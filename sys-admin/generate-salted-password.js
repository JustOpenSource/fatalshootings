var password = require('password-hash-and-salt');

var myuser = [];
 
// Creating hash and salt 
password('test').hash(function(error, hash) {
    if(error)
        throw new Error('Something went wrong!');
 
 	console.log('password hash ---------------');
    console.log(hash);
})