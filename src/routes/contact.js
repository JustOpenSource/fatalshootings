var __base = __base || '../';
var c = require(__base + 'constants');
var log = require(__base + 'utils/log')('routes/contact');
var router = require('express').Router();
var renderView = require(__base + 'utils/render-view');
var email   = require("emailjs");

var emailPass = require(__base + 'email-pass');
var emailName = 'sdf.mailer@gmail.com';
var toEmail = 'troythewolfe@gmail.com';
var subject = 'Fatal Encounters Contact Form'

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

    var server  = email.server.connect({
       user:    "sdf.mailer", 
       password: emailPass, 
       host:    "smtp.gmail.com", 
       ssl:     true
    });

    server.send({
       text:    req.body.message + '\n\n---------\n\n' + req.body.name + ' \n\n' + req.body.email,
       from:    "you <username@your-email.com>", 
       to:      "someone <troythewolfe@gmail.com>",
       subject: subject
    }, function(err, message) {
        if(err){
            res.redirect('/contact?error=true')
        } else {
            res.redirect('/contact?success=true')
        }
    });
});

module.exports = router;