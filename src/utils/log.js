var log = {};

module.exports = function(location) {

    function logger() {

        this.log = function(type, msg, data){
        
            var dataString;

            if(msg){

                var output = location + ' : ' + msg + (data ? ' : ' + JSON.stringify(data) : '');

                if(type === 'find'){
                    
                    console.error('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');

                }


                if(type === 'error'){
                    
                    console.error('! Error : ' + output);

                } else if(type === 'warn'){
                    
                    console.warn('Warning : ' + output);
                
                } else {
                    
                    console.log(output);
                
                }
            }
        }
    }

    //return new instance of logger
    return new logger().log;
};