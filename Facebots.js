// Made by camilleeyries (http://github.com/camilleeyries) (alias Faewui)

var AgarioClient = require('agario-client');
var amount = 100; //amount of bot
var begginAmount = amount;
var token = "null";
var myaccount = {c_user: "YOURCUSER", datr: "YOURDATR", xs: "YOURXS"};
var botChain = [];
var debugState = 0;
var serversChain = [];
var region = "EU-London";
var tempServ;
var interval;
var candidateFood = {};
var statChain = {averageMass: "NOT DEFINED !"};
var statInterval;
var statUpdateInterval;
var statScreenRefreshInterval = 100;
var statScreenUpdateInterval = 95;
var botMassChain = {};
var tempVar;
var connected = begginAmount;
var tokenRefresh = 30000;

var account = new AgarioClient.Account();
account.c_user = myaccount.c_user;
account.datr = myaccount.datr;
account.xs = myaccount.xs;

startStatScreen();

function ExampleBot(bot_id) {
    this.bot_id      = bot_id;         //ID of bot for logging
    this.nickname    = 'AGAR-XPBOT'; //default nickname
    this.verbose     = false;           //default logging enabled
    this.interval_id = 0;              //here we will store setInterval's ID

    this.client       = new AgarioClient(this.bot_id); //create new client
    this.client.debug = 0; //lets set debug to 1
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
		anotherTempVar.client.connect(this.server);
	},
	
    connect: function(server) {
		this.server = server;
		this.client.auth_token = token;
		var randomNumber = (Math.floor((Math.random() * 10) + 1) * 1000);
		var truc = this;
		setTimeout(function () {
			truc.client.connect(truc.server);
		}, randomNumber);
		this.Events();

	},
	
    Events: function() {
        var bot = this;

        bot.client.on('connected', function() {
            bot.log('Connected, spawning');
            bot.client.spawn(bot.nickname);
        });

        bot.client.on('connectionError', function(e) {
            bot.log('Connection failed with reason: ' + e);
            bot.log('Server address set to: ' + bot.server + ' key ' + bot.server_key);
        });
		
		bot.client.on('ballAppear', function(id) {
			var ball = bot.client.balls[id];
			var candi;
			//console.log("candidateFood.bot" +bot.client.client_name);
			eval("candi = candidateFood.bot" +bot.client.client_name);
			if (ball.mass == 1 && candi === null) {
				eval("candidateFood.bot" + bot.client.client_name + " = " + id);
				//console.log("new candidate. mass: " + ball.mass);
				bot.client.moveTo(ball.x, ball.y);
				bot.client.split();
			}
			
		});
		
		bot.client.on('packetError', function(packet, err, preventCrash) {
		   bot.client.log('Packet error detected for packet: ' + packet.toString());
		   bot.client.log('Crash will be prevented, bot will be disconnected');
		   preventCrash();
	//	   bot.client.disconnect();
		});

		bot.client.on('somebodyAteSomething', function(eater_id, eaten_id) {
			var candi;
			eval("candi = candidateFood.bot"+ bot.client.client_name);
			if (eaten_id == candi) {
				eval("candidateFood.bot" + bot.client.client_name + " = null");
				//console.log("my target was eated.");
			}
			if (bot.client.balls[bot.client.my_balls[0]] !== undefined) {
				//console.log("										my size: " + bot.client.balls[bot.client.my_balls[0]].mass);
				updateBotMassChain(bot.client.balls[bot.client.my_balls[0]].mass, bot.client.client_name);
			}
			
			
		});

        bot.client.on('lostMyBalls', function() {
            bot.client.log('Lost all my balls, respawning');
            bot.client.spawn(bot.nickname);
        });

        bot.client.on('disconnect', function() {
            bot.client.log('Disconnected from server, bye!');
			connected--;
			console.log("connected bots: " +connected);
			var randomNumber = (Math.floor((Math.random() * 10) + 1) * 1000);
			setTimeout(function () {
				bot.client.connect(bot.server);
				connected++;
				console.log("connected bots: " +connected);
			}, randomNumber);
        });

        bot.client.on('reset', function() { //when client clears everything (connection lost?)
		//	console.log("connection lost !					" + bot.client.client_name);
		/*	var randomNumber = (Math.floor((Math.random() * 10) + 1) * 1000);
			setTimeout(function () {
				bot.client.connect(bot.server);
			}, randomNumber);*/

        });
		
		bot.client.on('experienceUpdate', function(level, current_exp, need_exp) { //if facebook key used and server sent exp info
		    bot.client.log('Current Level' + level + ' and experience is ' + current_exp + '/' + need_exp);
		});
		
    }
};


account.requestFBToken(function(obtainedToken, info) {
    //If you have `token` then you can set it to `client.auth_token`
    // and `client.connect()` to agar server
	if (info.error) console.log('error when trying to obtain fb token: ' + info.error);
	
	token = obtainedToken;
	console.log("\033[44m\033[35mTOKEN : \033[32m" + token);
	console.log("\033[35mQuery a new token in : \033[32m" + tokenRefresh + " millisecond");
	setInterval(updateToken, tokenRefresh);
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
		console.log("\033[35mQuery a new token in : \033[32m" + tokenRefresh + " millisecond");
		console.log(account);
		console.log('\033[40m\033[37m');
	});
	
}

function start() {
	
		if (token == "null") {
			return console.log('no token.');
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
	amount = begginAmount;
	if (debugState == 1) {
		console.log("requesting different FFA servers for Bots...");
		debugState++;
	}
	while (amount !== 0 ){
		RequestFFAServer();
		amount--;
		
	}
	if (amount === 0) {
		setTimeout(console.log('successfull ! !' + serversChain), 3000);
		amount = begginAmount;
	}
}

function RequestFFAServer() {
	AgarioClient.servers.getFFAServer({region: region}, function(srv) {
	    if(!srv.server) return console.log('Failed to request server (error=' + srv.error + ', error_source=' + srv.error_source + ')'); // in case of error...
		tmp = "ws://" + srv.server;
		console.log("Server IP: " + tmp);
		serversChain.push(tmp);
		connectABot(tmp);
	});
}

function connectABot(server) {
	var Fbot = new ExampleBot(amount.toString());
	Fbot.connect(server);
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
	for ( data in botMassChain) {
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
