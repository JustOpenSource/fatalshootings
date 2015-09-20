var __base = __base || '../';
var password = require('password-hash-and-salt');

var USER_PASSWORD = 'test';


password(USER_PASSWORD).hash(function(error, hash) {
    if(error) {
        throw new Error('Could not generate hash and salt from password');
    }
 
 	console.log('password ===================');
    console.log(hash);
    console.log('/===========================');
})