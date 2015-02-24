
//set base global so require can use absolute paths
global.__base = __dirname + '/';

var c = require(__base + '../shared-config/constants');
var log = c.getLog('explore/app');
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var hogan = require('hogan-express');
var app = express();

// view engine setup
app.engine('html', hogan);
app.set('views', [path.join(__dirname + '/../', 'shared-views'), path.join(__dirname, 'views')]);
app.set('view engine', 'html');
app.set('layout', 'layout');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('less-middleware')(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

module.exports = app;
