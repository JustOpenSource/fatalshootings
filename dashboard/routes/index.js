var express = require('express');
var router = express.Router();

var design_name = 'analysis';
var design_view = 'formatted';

/* GET home page. */
router.get('/', function(req, res) {
    var routes = [
        { route: '/', description: 'The page you are on'},
        { route: '/explore/formatted', description: 'JSON of all data has reformatted to match schema.'},
        { route: '/explore/normalized', description: 'JSON of all data that has been normalized and formatted'}
    ]
    res.render('index',{routes: routes });
});

module.exports = router;