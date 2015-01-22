var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
    var routes = [
        { route: '/', description: 'The page you are on'},
        { route: '/explore/formatted', description: 'JSON of all data has reformatted to match schema.'},
        { route: '/explore/normalized', description: 'JSON of all data that has been normalized and formatted'},
        { route: '/explore/normalized/specific/:id', description: 'version of /explore/normalized that allows you to pass in one or many keys as a csv as the id param' },
        { route: '/explore/normalized/compare/:id', description: 'pulls data from original database, /explore/formatted, and /explore/normalized and displays side by side, allows you to pass in one key or a csv as the id param'},
        { route: '/explore/install/clean', description: 'Installs \'pfc\' database and populates with data from /explore/normalized'},
        { route: '/data/', description: 'Lists all entries in the database'},
        { route: '/data/:id', description: "displays entry and edit screen"},   
    ]
    res.render('index',{routes: routes });
});

router.get('/test',function(req,res){
    var entry = require('../db/models/entry');
    entry.create({test: false, message: 'party'},function(body){
        res.json(body);
    });
});

module.exports = router;