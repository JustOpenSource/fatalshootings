var __base = __base || '../';
var c = require(__base + 'constants');
var log = require(__base + 'utils/log')('routes/login');
var router = require('express').Router();
var password = require('password-hash-and-salt');
var renderView = require(__base + 'utils/render-view');
var _ = require('underscore');

//var HOST = req.get('host');
var HOST = 'localhost:8000';
var LOGIN_URL = 'https://' + HOST + '/login';
var DEFAULT_ROLES = ['researcher'];

/*
parseRoles
turn roles array into an object with roleName: true
**/
function parseRolesCollection(roles){
	var rolesCollection = [];

	roles = roles ? roles : DEFAULT_ROLES;

	_.each(roles, function(role){
		rolesCollection.push({
			"name" : role
		});
	});

	return rolesCollection;
}

function parseRolesObject(roles){
    var rolesObject = {};

    roles = roles ? roles : DEFAULT_ROLES;

    _.each(roles, function(role){
        rolesObject[role] = true;
    });

    return rolesObject;
}

/*
findUser
get the user by email from the users collection
**/
function findUser(collection, email, cb){
	collection.find({
		
		"email" : email

	}).toArray(function(err, body){
		
		if(err){
		
			cb(err);
		
		} else if(body.length < 1){

			console.log('no users found with the email: ' + email);
			cb(true);
		
		} else {
		
			console.log(JSON.stringify(body));
			cb(null, body[0]);
		
		}
	});
}

/*
verifyPassword
compare the submitted password to the stored
**/
function verifyPassword(attemptedPass, storedPass, cb){

	password(attemptedPass).verifyAgainst(storedPass, function(error, verified) {

        if(error) {
        	
        	console.log('error attempting to create hash of storedPass');
            cb(false);

        } else if(!verified) {

        	cb(false);

        } else {

            cb(true);
        }
    });
}

// url/login/
router.route('/')
.get(function(req, res){

	if(req.protocol !== 'https'){
		//this redirect doesn't work in devo
		
		res.redirect(LOGIN_URL);
	}

	if(req && req.session && req.session.roles){
		log('trace', 'roles', req.session.roles);
	}
	
    var page_title = 'Contributor Login';

    renderView(req, res, 'login', {

       message: req.params.message
    
    }, {

        title: page_title,
        js: [''],
        css: ['']
    });
})

//TODO: too deeply nested, flatten this out
.post(function(req, res){

	if(!req.body || req.body.email == '' || req.body.password == ''){
		return res.redirect(LOGIN_URL + '?message=missing');
	}

	findUser(req._db.users, req.body.email, function(err, body){

		if(err){

			console.log(err);
			return res.redirect(LOGIN_URL + '?message=invalid');
		}

		verifyPassword(req.body.password, body.password, function(verified){
			
			if(verified){

				req.session.user = {
					username: body.username,
					roles: parseRolesCollection(body.roles),
                    rolesObject: parseRolesObject(body.roles)
				}

				return res.redirect(LOGIN_URL + '?message=success');
			
			} else {
			
				return res.redirect(LOGIN_URL + '?message=invalid');
			
			}
		});
	});

});

module.exports = router;