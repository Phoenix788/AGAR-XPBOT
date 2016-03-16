/**
 * Made with <3 by camilleeyries (http://github.com/camilleeyries) (alias Faewui)
 * Using AGARIO-CLIENT (https://github.com/pulviscriptor/agario-client) (pulviscriptor)
 **/


// ----- CONFIG -----

amount = 300; // Amount of bots
restartTimer = 30; // Restart Timeout in mins..  Set to 0 for no restart
accNumber = 1;  // Which account to use
region = "EU-London";  // EU-London -- RU-Russia -- TK-Turkey -- CN-China -- BR-Brazil
accountsArr = [
	//{c_user: "YOUR_C_USER_1", datr: "YOUR_DATR_1", xs: "YOUR_XS_1"},
    {c_user: "100009962194768", datr: "F6SnVvGpOOC1f-wt3YfVtXr9", xs: "168%3A0IOoCu-Yv2VJ9g%3A2%3A1453827132%3A10285"},
	{c_user: "YOUR_C_USER_2", datr: "YOUR_DATR_2", xs: "YOUR_XS_2"},
	{c_user: "YOUR_C_USER_3", datr: "YOUR_DATR_3", xs: "YOUR_XS_3"},
];
tokenRefresh = 5; // Time to refresh fb token in mins
//botsName = 'AGAR-XPBOT'; // Bots name
botsName = '﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽௵'; // Bots name
debug = 0; // Set to 1 for debugging

// ------------------






var AgarioClient = require('agario-client');
var beginAmount = amount;
var token = null;
myaccount = accountsArr[accNumber-1];
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

var account = new AgarioClient.Account();
account.c_user = myaccount.c_user;
account.datr = myaccount.datr;
account.xs = myaccount.xs;


if (restartTimer) {
	console.log('Restart planned in ' + restartTimer + ' Minutes(s)...');
	setInterval( function() {
		restartTimer--;
		console.log('Restarting in ' + restartTimer + ' Minutes(s)...');
	}, 60000);
	setTimeout(function () {
		process.exit();
	}, restartTimer * 60 * 1000)
}

process.stdout.write(String.fromCharCode(27) + "]0;" + ' --- Facebots ---  ' + region + String.fromCharCode(7)); // Set title

startStatScreen();

function ExampleBot(bot_id) {
	this.bot_id      = bot_id;         //ID of bot for logging
	this.nickname    = botsName;
	this.verbose     = debug;           //default logging enabled
	this.interval_id = 0;              //here we will store setInterval's ID

	this.client       = new AgarioClient(this.bot_id); //create new client
	this.client.debug = debug; //lets set debug to 1
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
			bot.log('Server address set to: ' + bot.server + ' key ' + bot.key);
		});

		bot.client.on('myNewBall', function(id) {
			var ball = bot.client.balls[id];
			eval("candidateFood.bot" + bot.client.client_name);
			bot.interval_id = setInterval(function(){bot.recalculateTarget()}, 100);  // Find food every 100ms
			bot.client.split();
			bot.client.split();

		});

		bot.client.on('packetError', function(packet, err, preventCrash) {
			clearInterval(bot.interval_id);
			bot.client.log('Packet error detected for packet: ' + packet.toString());
			bot.client.log('Crash will be prevented, bot will be disconnected');
			preventCrash();
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
			bot.client.log('Eaten, Respawning');
			bot.client.spawn(bot.nickname);
		});

		bot.client.on('disconnect', function() {
			clearInterval(bot.interval_id);
			bot.client.log('Disconnected from server...');
			connected--;
			console.log("Connected bots: " +connected);
			setTimeout(function () {
				bot.client.connect(bot.server, bot.key);
				//bot.reconnect();
				console.log("connected bots: " +connected);
			}, 300);
		});

		bot.client.on('reset', function() { //when client clears everything (connection lost?)
			//	console.log("connection lost !					" + bot.client.client_name);
            bot.reconnect();
		});

		bot.client.on('experienceUpdate', function(level, current_exp, need_exp) { //if facebook key used and server sent exp info
			bot.client.log('Current Level' + level + ' and experience is ' + current_exp + '/' + need_exp);
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
	// If you have `token` then you can set it to `client.auth_token`
	// and `client.connect()` to agar server

	if (info.error || obtainedToken == null) {
        setTimeout(function () {
            process.exit();
        }, 3000);
        return console.log('Error when trying to obtain fb token: ' + info.error);
    }

	token = obtainedToken;
	console.log("\033[44m\033[35mTOKEN : \033[32m" + token);
	console.log("\033[35mQuery a new token in : \033[32m" + tokenRefresh * 60 + "Second(s)");
	setInterval(updateToken, tokenRefresh * 60 * 1000);
	console.log(account);
	start();
});

function updateToken() {
	account.requestFBToken(function(obtainedToken, info) {
		//If you have `token` then you can set it to `client.auth_token`
		// and `client.connect()` to agar server
		if (info.error) console.log('error when trying to obtain fb token: ' + info.error);

		token = obtainedToken;
		console.log("\033[44m\033[35mNEW TOKEN : \033[32m" + token);
		console.log("\033[35mQuery a new token in : \033[32m" + tokenRefresh * 60 + " Second(s)");
		console.log(account);
		console.log('\033[40m\033[37m');
	});

}

function start() {

	if (token == "null") {
		return console.log('No token.');
	}
	else{
		if (debugState === 0)
		{
			console.log("\033[40m\033[35mcreating and assigning token to bots... \033[31mTOKEN: \033[32m" + token + "\033[37m");
			debugState++;
		}

		ExampleBot.auth_token = token;
		makeServerChain();
	}

}

function makeServerChain() {
	amount = beginAmount;
	if (debugState == 1) {
		console.log("Requesting different FFA servers for Bots...");
		debugState++;
	}
	while (amount !== 0 ){
		RequestFFAServer();
		amount--;
	}
	if (amount === 0) {
		setTimeout(console.log('successfull ! !' + serversChain), 300);
		amount = beginAmount;
	}
}

function RequestFFAServer() {
	AgarioClient.servers.getFFAServer({region: region}, function(srv) {
		if(!srv.server) return console.log('Failed to request server (error=' + srv.error + ', error_source=' + srv.error_source + ')'); // in case of error...
		tmp = "ws://" + srv.server;
		//console.log("Server IP: " + tmp);
		serversChain.push(tmp);
		connectABot(tmp, srv.key);
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
	// AVERAGE MASS//
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