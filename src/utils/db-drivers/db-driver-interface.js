var gotit = require('gotit').default;

const dbDriverInterface = gotit([
    'getResult',
    'setResult',
    'getResults', 
    'setResults'
]);

const dbDriverInterfaceSig = {
    'getResult' : {
        'in' : gotit({}),
        'out' : gotit({})
    },
    'setResult' : {
        'in' : gotit({}),
        'out' : gotit({})
    },
    'getResults' : {
        'in' : gotit({}),
        'out' : gotit({})
    },
    'setResults' : {
        'in' : gotit({}),
        'out' : gotit({})
    }
};

module.exports = dbDriverInterface;