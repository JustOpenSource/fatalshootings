var c = {

    port: {
        'mongodb' : 27017,
        'explore' : 3000,
        'admin' : 3001,
        'sys-admin' : 3002
    },

    db: {
        fatalities: 'fatalities'
    },
    
    collection: {
        fatalities: 'fatalities'
    },
    
    url: {}
};

c.url.mongo = 'mongodb://localhost:' + c.port.mongodb + '/';

c.l = function(status, msg){

    console.log('\n');
    console.log(status);
    
    if(typeof msg !== 'undefined'){

        if(typeof msg === 'object'){
            
            console.log(JSON.stringify(msg, null, 2));
        
        } else {
            
            console.log(msg);
        }
    }               
}

module.exports = c;