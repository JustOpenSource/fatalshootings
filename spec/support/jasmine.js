var path = require('path'),
    Command = require('../../node_modules/jasmine/lib/command.js'),
    command = new Command(path.resolve()),
    Jasmine = require('../../node_modules/jasmine/lib/jasmine.js'),
    jasmine = new Jasmine({ projectBaseDir: path.resolve() });

command.run(jasmine, process.argv.slice(2));

// This is really just a cosmetic addition, to let us know when it is done
process.on('exit', function () {
    // If this is a child process, message the parent and let it know we're done
    if (process.send) {
        process.send('test complete');
    }
});