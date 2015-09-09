var c = require(__base + '../shared-config/constants');
var log = c.getLog('explore/routes/user');
var renderView = require(__base + '../shared-utils/render-view');
var router = express.Router();

// url/list/
router.route('/')
.get(function(req, res){

    var page_title = 'Fatal Encounters';

    renderView(req, res, 'user', {
       //view data
    }, {

        title: page_title,
        js: ['main/home'],
        css: ['home']
    });
})

module.exports = router;