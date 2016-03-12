var AgarioClient = require('agario-client');
var amount = 5;
var begginAmount = amount;
var account;
var token = "null";
var myaccount = {c_user: "100004281284637", datr: "e7HdVmBQ9kEkPZG5L5QMZok1", xs: "203%3ASG2ABr7g3o8xQA%3A2%3A1457372919%3A14980"};
var botChain = {};
var debugState = 0;
var serversChain = [];
var region = "EU-London";
var tempServ;

function obtainFacebookToken() {
	account = AgarioClient.Account()
	account.requestFBToken(function(obtainedToken, info) {
	    //If you have `token` then you can set it to `client.auth_token` 
	    // and `client.connect()` to agar server
		if (info.error) console.log('error when trying to obtain fb token: ' + info.error);
		
		token = obtainedToken;
		console.log("TOKEN : " + token);
		console.log("expire in : " account.token_expire)
	});
}


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
		eval(botObject + " = " + botName);
		botObject.auth_token = token;
		eval("botChain." + botName + " = " botName);
		
		amount--;
		makeServerChain;
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
	}
	else
	{
		tempServ = null;
	}
}
else {
	console.log("serversChain: " serversChain);
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
		else {
			i--;
		}
	}
	else {
		return true;
	}
}

function connectBots() {
	amount = begginAmount;
	while (amount != 0) {
		var botName = "bot" + amount;
		console.log(botName + " is connecting...");
		eval("botChain." + botName + ".connect(serversChain[amount]);");
		amount--;
	}
	
}