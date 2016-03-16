var forever = require('forever-monitor');
var child = new (forever.Monitor)('Facebots.js', {
    silent: false,
    args: ["--spinSleepTime", "10000"]
});
child.on('exit', function () {
    process.stdout.write('\033c'); // Clear console
    console.log('Facebots restarting...');
});

child.start();