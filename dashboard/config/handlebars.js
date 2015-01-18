function setup(req,res,next){
    var hbs = require('hbs');
    hbs.registerHelper('json', function(obj) {console.log(obj); return JSON.stringify(obj,undefined,2); });
    next();
}

module.exports = setup;