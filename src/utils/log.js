var log = {};

module.exports = function(location) {

    return function(type, msg, data) {

        var dataString;

        if(msg){

            //don't leave data null or undefined, set it to empty string
            dataString = data ? ' : ' + JSON.stringify(data) : '';

            //if type is error, convert to all caps
            type = type === 'error' ? '########### ' + type.toUpperCase() : type;

            console.log(location + ' : ' + type + ' : ' + msg + dataString);
        }
    }
};