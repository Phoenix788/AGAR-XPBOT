var AgarioClient = require('agario-client');
var amount = 10; //amount of bot
var begginAmount = amount;
var token = "null";
var myaccount = {c_user: "100004281284637", datr: "e7HdVmBQ9kEkPZG5L5QMZok1", xs: "203%3ASG2ABr7g3o8xQA%3A2%3A1457372919%3A14980"};
var botChain = {};
var debugState = 0;
var serversChain = [];
var region = "EU-London";
var tempServ;


var account = new AgarioClient.Account();
account.c_user = myaccount.c_user;
account.datr = myaccount.datr;
account.xs = myaccount.xs;

account.requestFBToken(function(obtainedToken, info) {
    //If you have `token` then you can set it to `client.auth_token`
    // and `client.connect()` to agar server
	if (info.error) console.log('error when trying to obtain fb token: ' + info.error);
	
	token = obtainedToken;
	console.log("\033[44m\033[31mTOKEN : \033[32m" + token);
	console.log("\033[31mexpire in : \033[32m" + account.token_expire);
	console.log(account);
	start();
});

function start() {
	while (amount != 0) {
		if (token == "null") {
			return;
		}
		else{
			if (debugState == 0)
				{
					console.log("\033[40m\033[35mcreating and assigning token to bots... \033[31mTOKEN: \033[32m" + token + "\033[37m");
					debugState++;
				}
				
			var botName = "bot" + amount;
			var botObject;
			eval("var " + botName + " = new AgarioClient(' "+ botName +" ');");
			eval("botChain." + botName + " = " + botName);
			eval("botChain." + botName + ".auth_token = token");
		//	botObject.auth_token = token;
			
			
			amount--;
			makeServerChain();
		}
	}
}

function makeServerChain() {
	if (debugState == 1) {
		console.log("requesting different FFA servers for Bots...");
		debugState++;
	}
	RequestFFAServer();
	if (amount == 0) {
		setTimeout(connectBots, 1000);
	}
}

function RequestFFAServer() {
	AgarioClient.servers.getFFAServer({region: region}, function(srv) {
	    if(!srv.server) return console.log('Failed to request server (error=' + srv.error + ', error_source=' + srv.error_source + ')'); // in case of error...
		tmp = "ws://" + srv.server;
		console.log("Server IP: " + tmp);
		serversChain.push(tmp);
		
	});
}

function connectBots() {
	amount = begginAmount;
	if (debugState == 2) {
		console.log("connecting bots...");
		debugState++;
	}
	while (amount != 0) {
		var botName = "bot" + amount;
		console.log(botName + " is connecting...");
		console.log(serversChain[amount - 1]);
		eval("botChain." + botName + ".connect(serversChain[amount - 1]);");
		amount--;
	}
	if (amount == 0) {
		assignEvents();
	}
}


function assignEvents() {
	amount = begginAmount;
	if (debugState == 3) {
		console.log("assigning events");
		debugState++;
	}
	while(amount != 0) {
		botName = "bot" + amount;
		botName = "botChain." + botName;
		eval(botName + ".on('connected', function() {botName.spawn('facebots ;\)'); console.log('spawning');});");
		eval(botName + ".on('lostMyBalls', function() {botName.spawn('facebots ;\)'); console.log('respawning');});");
		/*botObject.on('connected', connected);
		botObject.on('lostMyBalls', died);*/
	}
	
	
}


