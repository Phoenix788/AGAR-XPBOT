var forever = require('forever-monitor');
var child = new (forever.Monitor)('Facebots.js', {
    silent: false,
    args: ["--spinSleepTime", "10000"] // Not working
});
child.on('exit', function () {
    // process.stdout.write('\033c'); // Clear console  // Not working
    console.log('Facebots restarting...');  // Not working
});

child.start();