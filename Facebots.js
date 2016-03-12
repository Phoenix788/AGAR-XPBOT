var AgarioClient = require('agario-client');
var amount = 5;
var begginAmount = amount;
var token = "null";
var myaccount = {c_user: "YOURCUSER", datr: "YOURDATR", xs: "YOURXS"};
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
	console.log("TOKEN : " + token);
	console.log("expire in : " + account.token_expire);
	console.log(account);
	start();
});

function start() {
	while (amount != 0) {
		if (token != "null") {
			return;
		}
		else{
			if (debugState == 0);
				{
					console.log("creating and assigning token to bots... TOKEN: " + token);
					debugState++;
				}
				
			var botName = "bot" + amount;
			var botObject;
			eval("var " + botName + " = new AgarioClient(' "+ botName +" ');");
			eval("botChain." + botName + " = " + botName);
			eval("botChain." + botName + ".auth_token = token");
		//	botObject.auth_token = token;
			
			
			amount--;
			makeServerChain;
		}
	}
}

function makeServerChain() {
	if (debugState == 1) {
		console.log("requesting different FFA servers for Bots...");
		debugState++;
	}
	amount = begginAmount;
	while (amount != 0) {
	tempServ = RequestFFAServer();
	var yesOrNot = verifyIP(tempServ);
	if (yesOrNot = true) {
		serversChain.push(tempServer);
		tempServ = null
		amount--;
	} else {
		tempServ = null;
	}
} 
if(amount == 0) {
	console.log("serversChain: " + serversChain);
	connectBots();
}

}

function RequestFFAServer() {
	AgarioClient.servers.getFFAServer({region: region}, function(srv) { 
	    if(!srv.server) return console.log('Failed to request server (error=' + srv.error + ', error_source=' + srv.error_source + ')'); // in case of error...
		tempServ = "ws://" + srv.server;
		
	});
	return tempServ;
}

function verifyIP(server) {
	var i;
	i = serversChain.length();
	while (i != 0) {
		if (server == serversChain[i]);
		{
			return false;
		}
		i--;
	}
	if (i == 0){
		return true;
	}
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
		eval("botChain." + botName + ".connect(serversChain[amount]);");
		amount--;
	}
	if (amount == 0) {
		assignEvents;
	}
}

function assignEvents() {
	amount = begginAmount;
	
	
}
