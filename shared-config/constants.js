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
        fatalities: 'fatal-encounter-records',
        users: 'fatal-encounter-users'
    },
    
    url: {}
};

c.getLog = function (location) {

    return function(type, msg, data) {

        if(msg){
            var dataString = data ? ' : ' + JSON.stringify(data) : '';

            console.log(location + ' : ' + type + ' : ' + msg + dataString);
        }
    }
}

module.exports = c;