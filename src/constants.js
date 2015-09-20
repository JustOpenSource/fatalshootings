//constants
var c = {

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
            var dataString;

            try {
                dataString = data ? ' : ' + JSON.stringify(data) : '';
            } catch(e){
                dataString = '';
            }

            if(type === 'error'){
                type = '!!!! ERROR';
            }

            console.log(location + ' : ' + type + ' : ' + msg + dataString);
        }
    }
}

module.exports = c;