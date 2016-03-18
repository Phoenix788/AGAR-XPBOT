/**
 * Made with <3 by camilleeyries (http://github.com/camilleeyries) (alias Faewui)
 * Using AGARIO-CLIENT (https://github.com/pulviscriptor/agario-client) (pulviscriptor)
 **/
var Socks;
try {
    Socks = require('socks');
}catch(e){
    console.log('Failed to load `socks` lib. Install it in examples path using:');
    console.log('  npm install socks ');
    process.exit(0);
}
//Make random proxy selection- AgarioCheats
var number = 0;
function random () {
	number+=Math.floor(Math.random() * (20));
	if(number %2 == 1){
		if(number == 20) {
			number = number-1;
		} else {
			number = number+1;
		}
	}
    return number
}
random();
console.log(number);

//----Socks LIST (Update these to your working socks list)----------------

var listOfSocks = {
	proxy1: '85.94.190.125', //0
	port1: '34002',
	proxy2: '88.151.143.222',
	port2: '34002',
	proxy3: '88.151.25.234',
	port3: '34002',
	proxy4: '88.199.56.150',
	port4: '34002',
	proxy5: '88.220.122.198',
	port5: '34002',
	proxy6: '89.117.107.237', //10
	port6: '34002',
	proxy7: '89.39.120.250',
	port7: '34002',
	proxy8: '85.25.207.96',
	port8: '56863',
	proxy9: '85.25.207.96',
	port9: '55174',
	proxy10: '85.67.105.3',
	port10: '34002',
	proxy11: '89.117.235.25',
	port11: '34002' //20
};

//----Socks LIST (Update these to your working socks list)----------------

var proxy = function (obj) {
    var keys = Object.keys(obj)
    return obj[keys[number]];
};
var port = function (obj) {
    var keys = Object.keys(obj)
    return obj[keys[number+1]];
};

console.log(proxy(listOfSocks));
console.log(port(listOfSocks));

var AgarioClient = require('agario-client');
config = require("../config.js");
var beginAmount = config.amount;
var token = null;
myaccount = config.accountsArr[config.accNumber-1];
var botChain = [];
var debugState = 0;
var serversChain = [];
var tempServ;
var interval;
var candidateFood = {};
/* var statChain = {averageMass: "NOT DEFINED !"};
 var statInterval;
 var statUpdateInterval;
 var statScreenRefreshInterval = 100;
 var statScreenUpdateInterval = 95; */
var botMassChain = {};
var tempVar;
var connected = 0;
regions = config.regions;

function createAgent() {
    return new Socks.Agent({
            proxy: {
               // ipaddress: process.argv[3],
                //port: parseInt(process.argv[4]),
                //type: parseInt(process.argv[2])
                ipaddress: proxy(listOfSocks),
                port: parseInt(port(listOfSocks)),
                type: parseInt(4)
            }}
    );
}
var agent = createAgent();

var account = new AgarioClient.Account();
account.c_user = myaccount.c_user;
account.datr = myaccount.datr;
account.xs = myaccount.xs;


if (config.restartTimer) {
	console.log('Restart planned in ' + config.restartTimer + ' Minutes(s)...');
	setInterval( function() {
        config.restartTimer--;
		console.log('Restarting in ' + config.restartTimer + ' Minutes(s)...');
	}, 60000);
	setTimeout(function () {
		process.exit();
	}, config.restartTimer * 60 * 1000)
}

//process.stdout.write(String.fromCharCode(27) + "]0;" + ' --- Facebots ---  ' + region + String.fromCharCode(7)); // Set title

startStatScreen();

var regionCounterFFA = 0,
    regionCounterParty = 0;

function getRegionFFA() {
    regionCounterFFA++;
    if (regionCounterFFA >= regions.length) regionCounterFFA = 0;
    return regions[regionCounterFFA];
}

function getRegionParty() {
    regionCounterParty++;
    if (regionCounterParty >= regions.length) regionCounterParty = 0;
    return regions[regionCounterParty];
}

function ExampleBot(bot_id) {
	this.bot_id      = bot_id;         //ID of bot for logging
	this.nickname    = config.botsName;
	this.verbose     = config.debug;           //default logging enabled
	this.interval_id = 0;              //here we will store setInterval's ID

	this.client       = new AgarioClient(this.bot_id); //create new client
	this.client.debug = config.debug; //lets set debug to 1
	this.server = '';
	this.auth_token = null;
}

ExampleBot.prototype = {
	log: function(text) {
		if(this.verbose) {
			console.log(this.bot_id + ' says: ' + text);
		}
	},

	reconnect: function() {
		this.client.auth_token = token;
		this.client.connect(this.server, this.key);
	},

	connect: function(server, key) {
		this.server = server;
		this.key = key;
		this.client.auth_token = token;
		var truc = this;
		truc.client.connect(truc.server, this.key);
		this.Events();

	},

	Events: function() {
		var bot = this;

		bot.client.on('connected', function() {
			clearInterval(bot.interval_id);
			connected++;
			bot.log('Connected, spawning');
			bot.client.spawn(bot.nickname);
		});

		bot.client.on('connectionError', function(e) {
			clearInterval(bot.interval_id);
			bot.log('Connection failed with reason: ' + e);
            if (config.debug) {
                bot.log('Server address set to: ' + bot.server + ' key ' + bot.key);
            }
		});

		bot.client.on('myNewBall', function(id) {
			var ball = bot.client.balls[id];
            /* if (bot.client.balls[bot.client.my_balls[0]] !== undefined) {
                var mass = bot.client.balls[bot.client.my_balls[0]];
                bot.client.log('MASS: ' + mass);
            } */
			eval("candidateFood.bot" + bot.client.client_name);
			bot.interval_id = setInterval(function(){bot.recalculateTarget()}, 100);  // Find food every 100ms
			bot.client.split();

		});

		bot.client.on('packetError', function(packet, err, preventCrash) {
			clearInterval(bot.interval_id);
            if (config.debug) {
                bot.client.log('Packet error detected for packet: ' + packet.toString());
                bot.client.log('Crash will be prevented, bot will be disconnected');
            }
			preventCrash();
            connected--;
			bot.reconnect();
		});

		bot.client.on('somebodyAteSomething', function(eater_id, eaten_id) {
			eval("candi = candidateFood.bot"+ bot.client.client_name);
			if (eaten_id == candi) {
				eval("candidateFood.bot" + bot.client.client_name + " = null");
				//console.log("my target was eated.");
			}
			if (bot.client.balls[bot.client.my_balls[0]] !== undefined) {
				//console.log("								   my size: " + bot.client.balls[bot.client.my_balls[0]].mass);
				updateBotMassChain(bot.client.balls[bot.client.my_balls[0]].mass, bot.client.client_name);
			}


		});

		bot.client.on('lostMyBalls', function() {
			bot.client.log('Got eaten, Respawning');
			bot.client.spawn(bot.nickname);
		});

		bot.client.on('disconnect', function() {
			clearInterval(bot.interval_id);
            if (config.debug) {
                bot.client.log('Disconnected from server...');
            }
			connected--;
			setTimeout(function () {
				bot.client.connect(bot.server, bot.key);
				//bot.reconnect();
                if (config.debug) {
                    console.log("Connected bots: " + connected);
                }
			}, 500);
		});

		bot.client.on('reset', function() { //when client clears everything (connection lost?)
			//	console.log("connection lost !					" + bot.client.client_name);
            bot.reconnect();
		});

		bot.client.on('experienceUpdate', function(level, current_exp, need_exp) { //if facebook key used and server sent exp info
			bot.client.log('Current Level ' + level + ' and experience is ' + current_exp + '/' + need_exp);
		});
	},

	getDistanceBetweenBalls: function(ball_1, ball_2) {
		return Math.sqrt( Math.pow( ball_1.x - ball_2.x, 2) + Math.pow( ball_2.y - ball_1.y, 2) );
	},

	recalculateTarget: function() {
		var bot = this;
		var candidate_ball = null;
		var candidate_distance = 0;
		var my_ball = bot.client.balls[ bot.client.my_balls[0] ];
		if(!my_ball) return;

		for(ball_id in bot.client.balls) {
			var ball = bot.client.balls[ball_id];
			if(ball.virus) continue;
			if(!ball.visible) continue;
			if(ball.mine) continue;
			if(ball.size/my_ball.size > 0.5) continue;
			var distance = bot.getDistanceBetweenBalls(ball, my_ball);
			if(candidate_ball && distance > candidate_distance) continue;

			candidate_ball = ball;
			candidate_distance = bot.getDistanceBetweenBalls(ball, my_ball);
		}
		if(!candidate_ball) return;

		bot.client.moveTo(candidate_ball.x, candidate_ball.y);
	}
};


account.requestFBToken(function(obtainedToken, info) {
	if (info.error || obtainedToken == null) {
        setTimeout(function () {
            process.exit();
        }, 5000);
        return console.log('Error when trying to obtain fb token: ' + info.error);
    }

	token = obtainedToken;
	console.log("\033[44m\033[35mTOKEN : \033[32m" + token);
	console.log("\033[35mQuery a new token in : \033[32m" + config.tokenRefresh * 60 + " Second(s)");
	setInterval(updateToken, config.tokenRefresh * 60 * 1000);
	console.log(account);
	start();
});

function updateToken() {
	account.requestFBToken(function(obtainedToken, info) {
		//If you have `token` then you can set it to `client.auth_token`
		// and `client.connect()` to agar server
		if (info.error || obtainedToken == null) {
           return console.log('Error when trying to obtain fb token: ' + info.error);
        }

		token = obtainedToken;
		console.log("\033[44m\033[35mNEW TOKEN : \033[32m" + token);
		console.log("\033[35mQuery a new token in : \033[32m" + config.tokenRefresh * 60 + " Second(s)");
		console.log(account);
		console.log('\033[40m\033[37m');
	});

}

function start() {

	if (token == "null") {
		return console.log('No token.');
	}
	else{
		if (debugState == 0)
		{
			console.log("\033[40m\033[35mcreating and assigning token to bots... \033[31mTOKEN: \033[32m" + token + "\033[37m");
			debugState++;
		}

		ExampleBot.auth_token = token;
		makeServerChain();
	}

}

function makeServerChain() {
    console.log("Connecting...");

    amount = beginAmount/2;
	if (debugState == 1) {
		console.log("Requesting different FFA servers for Bots...");
		debugState++;
	}
	while (amount != 0 ){
		RequestFFAServer(getRegionFFA());
		RequestExpServer(getRegionFFA());
       	RequestPartyServer(getRegionParty());
        amount--;
	}
	if (amount == 0) {
		setTimeout(console.log('Successfull !' + serversChain), 1000);
		amount = beginAmount;
	}
}
function RequestExpServer(region) {
		AgarioClient.servers.getExperimentalServer({region: region, agent: agent}, function(srv) {
		if(!srv.server) return console.log('Failed to EXP request server (error=' + srv.error + ', error_source=' + srv.error_source + ')'); // in case of error...
		server = "ws://" + srv.server;
        if (config.debug) {
            console.log("Server IP: " + server);
        }
		serversChain.push(server);
		connectABot(server, srv.key);
	});	
}

function RequestFFAServer(region) {
	AgarioClient.servers.getFFAServer({region: region, agent: agent}, function(srv) {
		if(!srv.server) return console.log('Failed to FFA request server (error=' + srv.error + ', error_source=' + srv.error_source + ')'); // in case of error...
		server = "ws://" + srv.server;
        if (config.debug) {
            console.log("Server IP: " + server);
        }
		serversChain.push(server);
		connectABot(server, srv.key);
	});	
}

var get_server_opt = {
    region: getRegionFFA(), //server region
    agent:  agent        //our agent
};

if(process.argv[2] == '4') {
    get_server_opt.resolve = true;
}

function RequestPartyServer(region) {
    AgarioClient.servers.createParty({region: region, agent: agent}, function(srv) {
        if(!srv.server) return console.log('Failed to request PARTY server (error=' + srv.error + ', error_source=' + srv.error_source + ')'); // in case of error...
        server = "ws://" + srv.server;
        if (config.debug) {
            console.log("Server IP: " + server);
        }
        serversChain.push(server);
        connectABot(server, srv.key);
    });
}

function connectABot(server, key) {
	var Fbot = new ExampleBot(amount.toString());
	Fbot.connect(server, key);
    amount--;
}

function startStatScreen() {
//	statInterval = setInterval(printStatScreen, statScreenRefreshInterval);
	//statUpdateInterval = setInterval(recalculateStatScreen, statScreenUpdateInterval);
}

function printStatScreen() {
	console.log("\033[2J\033[;HAverage mass: " + statChain.averageMass);
}

function recalculateStatScreen() {
	//////////////////
	// AVERAGE MASS AgarVIPbots.com//
	/////////////////
	var tmpLength = Object.size(botMassChain);
	var i = 0;
	var tempNumber = 0;
	for (data in botMassChain) {
		tempNumber = tempNumber + data;
		statChain.averageMass = (tempNumber / tmpLength);
		console.log(statChain.averageMass + "  			" + tempNumber + "/" + tmpLength);
	}

}

function updateBotMassChain(mass, botName) {
	//console.log(botName);
	eval("botMassChain['bot" + botName + "'] = " + mass);
}

Object.size = function(obj) {
	var size = 0, key;
	for (key in obj) {
		if (obj.hasOwnProperty(key)) size++;
	}
	return size;
};
