var c = require(__base + '../shared-config/constants');
var log = c.getLog('explore/routes/home');
var router = express.Router();
var password = require('password-hash-and-salt');
var renderView = require(__base + '../shared-utils/render-view');
<<<<<<< HEAD
var _ = require('underscore');
=======
>>>>>>> 80176e8385e0a55dc90c93ba43a00b565af30b23

//var HOST = req.get('host');
var HOST = 'localhost:8000';
var LOGIN_URL = 'https://' + HOST + '/login';
var DEFAULT_ROLES = ['researcher'];

/*
<<<<<<< HEAD
parseRoles
turn roles array into an object with roleName: true
**/
function parseRoles(roles){
	var rolesObj = {};

	roles = roles ? roles : DEFAULT_ROLES;

	_.each(roles, function(role){
		rolesObj[role] = true;
	});

	return rolesObj;
}

/*
=======
>>>>>>> 80176e8385e0a55dc90c93ba43a00b565af30b23
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

<<<<<<< HEAD
	if(req && req.session && req.session.roles){
		log('trace', 'roles', req.session.roles);
	}
	

=======
>>>>>>> 80176e8385e0a55dc90c93ba43a00b565af30b23
    var page_title = 'Contributor Login';

    renderView(req, res, 'login', {

       message: req.params.message
    
    }, {

        title: page_title,
        js: [''],
        css: ['']
    });
})

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

<<<<<<< HEAD
				req.session.roles = parseRoles(body.roles);
=======
				req.session.roles = body.roles || DEFAULT_ROLES;
>>>>>>> 80176e8385e0a55dc90c93ba43a00b565af30b23

				return res.redirect(LOGIN_URL + '?message=success');
			
			} else {
			
				return res.redirect(LOGIN_URL + '?message=invalid');
			
			}
		});
	});

});

module.exports = router;