var __base = __base || '../';
var email   = require("emailjs");
var emailPass = require(__base + 'email-pass');
var emailName = 'sdf.mailer@gmail.com';
var toEmail = 'troythewolfe@gmail.com';
var subject = 'Fatal Encounters Contact Form';

module.exports = function(body, cb){
    var server  = email.server.connect({
       user:    "sdf.mailer", 
       password: emailPass, 
       host:    "smtp.gmail.com", 
       ssl:     true
    });

    server.send({
       text:    body.message + '\n\n---------\n\n' + body.name + ' \n\n' + body.email,
       from:    "sdf mailer <sdf.mailer@gmail.com>", 
       to:      "someone <troythewolfe@gmail.com>",
       subject: body.subject || subject
    }, function(err, message) {
        cb(err, message);
    });
}