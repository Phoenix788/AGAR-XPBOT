var forever = require('forever-monitor');

var child = new (forever.Monitor)('Facebots.js', {
    silent: false,
    args: []
});

child.on('exit', function () {
    console.log('Facebots are restarting...');
});

child.start();