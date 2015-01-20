function setup(req,res,next){
    var hbs = require('hbs');
    hbs.registerPartials(__dirname + '/../views/partials');
    hbs.registerHelper('json', function(obj) {return JSON.stringify(obj,undefined,2); });
    next();
}

module.exports = setup;