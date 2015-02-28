var winston = require('winston');
var _ = require('winston');
        
//constants
var c = {

    port: {
        'mongodb' : 27017,
        'explore' : 3000,
        'admin' : 3001,
        'sys-admin' : 3002
    },

    db: {
        fatalities: 'test-fatalities'
    },
    
    collection: {        
        fatalities: 'test-fatalities'
    },
    
    url: {}
};

c.url.mongo = 'mongodb://localhost:' + c.port.mongodb + '/';

//MOVE INTO LOGGER FILE
var FILE_SEP = '.',
    LOGS_DIR = __dirname + '/../log/';

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

c.getLog = function (location) {

    return function (type, msg, data) {

        //clone data so we can manipulate it
        data = _.clone(data);

        if(data){

            //if data is not an object, make it one move value into _data property
            data = typeof data === 'object' ? data : { '_data' : data };

        } else {

            data = {};
        }

        //add the current location to _loc data property
        data._loc  = location;
        
        console.log(' ');
        logger.log(type, msg, data);
        console.log(' ');
    }
}

module.exports = c;