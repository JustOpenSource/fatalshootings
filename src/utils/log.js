var log = {};

module.exports = function(location) {

    return function(type, msg, data) {

        var dataString;

        if(msg){

            var output = location + ' : ' + msg + (data ? ' : ' + JSON.stringify(data) : '');

            if(type === 'error'){
                
                console.error('! Error : ' + output);

            } else if(type === 'warn'){
                
                console.warn('Warning : ' + output);
            
            } else {
                
                console.log(output);
            
            }
        }
    }
};