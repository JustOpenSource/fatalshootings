var winston = require('winston');
var _ = require('underscore');
var app = require('../explore/app');

//constants
var c = {

    port: {
        'explore' : '',
        'admin' : 3001,
        'sys-admin' : 3002
    },

    db: {
        fatalities: ''
    },

    collection: {        
        fatalities: 'fatal-encounter-records'
    },
    
    url: {}
};

var urlRoot = 'http://localhost/';

c.url.mongo = 'mongodb://heroku:c-rJompa5mbNDiERpkBJMfKXbfSazY_YaBGqrnFzmwgao-WRaPHaU_ZED_TU7zp2C8lp3OV1azqFINmN6EQ27A@candidate.37.mongolayer.com:10928,candidate.13.mongolayer.com:11150/app40069500';
c.url.data = urlRoot + 'data/api/v1';
c.url.list = urlRoot + 'list';
c.url.distinct = c.url.data + '/distinct/';
c.url.details = c.url.data + '/details/';

//MOVE INTO LOGGER FILE
var FILE_SEP = '.',
    LOGS_DIR = __dirname + '/../log/';

/*
var logger = new (winston.Logger)({

    levels: {

        trace: 0,
        info: 1,
        error: 2
    },

    colors: {
        
        trace: 'magenta',
        info: 'blue',
        error: 'red'
    }
});

logger.add( winston.transports.Console, {

    level: 'trace',
    prettyPrint: true,
    colorize: true,
    silent: false,
});

logFileName = getLogFileName();

logger.add( winston.transports.File, {

    prettyPrint: false,
    level: 'info',
    silent: false,
    timestamp: true,
    filename: logFileName,
    maxsize: 40000,
    maxFiles: 10,
    json: false
});

function getLogFileName () {

    var today = new Date(),
        d = today.getDate(),
        d = d < 10 ? '0' + d : d,
        m = today.getMonth() + 1,
        m = m < 10 ? '0' + m : m,
        y = today.getFullYear();
    
    var filename = LOGS_DIR + y + '' + m + '' + d + '.log';

    return filename;
}
*/

c.getLog = function (location) {

    return function (type, msg, data) {

        data = data || '';
        
        console.log(' ');
        console.log(location);
        console.log(msg);
        console.log(data);
        console.log(' ');
    }
}

module.exports = c;
