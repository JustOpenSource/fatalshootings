var __base = __base || '../';
var c = require(__base + 'constants');
var log = require(__base + 'utils/log')('routes/contact');
var router = require('express').Router();
var renderView = require(__base + 'utils/render-view');
var sendEmail = require(__base + 'utils/send-email');

// url/list/
router.route('/')
.get(function(req, res){

    var page_title = 'Contact Us';

    renderView(req, res, 'contact', {
        "msg" : req.query.msg
    }, {
        title: page_title,
        css: ['contact']
    });

}).post(function(req, res){

    if(!req.body.name){
        res.redirect('/contact?missing=name');
    }

    if(!req.body.email){
        res.redirect('/contact?missing=email');
    }

    if(!req.body.message){
        res.redirect('/contact?missing=message');
    }

    sendEmail(req.body, (err, message)=>{
        if(err){
            res.redirect('/contact?error=true')
        } else {
            res.redirect('/contact?success=true')
        }
    });
});

module.exports = router;