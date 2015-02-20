var c = {
    nano: 'http://localhost:5984',
    mongo: 'http://localhost:5984',
    db_name: 'fe',
    id_prefix: 'fatality_',
    ports: {
        'explore' : 3000,
        'admin' : 3001,
        'sys-admin' : 3002
    }
};

c.l = function(status, msg){

    console.log('\n');
    console.log(status);
    
    if(msg){
        
        console.log('__________________\n');

        if(typeof msg === 'object'){
            
            console.log(JSON.stringify(msg, null, 2));
        
        } else {
            
            console.log(msg);
        }
    }               
}

module.exports = c;