var AgarioClient = require('agario-client');
var amount = 10; //amount of bot
var begginAmount = amount;
var token = "null";
var myaccount = {c_user: "1YOUR", datr: "YOUR", xs: "YOUR"};
var botChain = [];
var debugState = 0;
var serversChain = [];
var region = "EU-London";
var tempServ;


var account = new AgarioClient.Account();
account.c_user = myaccount.c_user;
account.datr = myaccount.datr;
account.xs = myaccount.xs;

function ExampleBot(bot_id) {
    this.bot_id      = bot_id;         //ID of bot for logging
    this.nickname    = 'Facebots :\)'; //default nickname
    this.verbose     = true;           //default logging enabled
    this.interval_id = 0;              //here we will store setInterval's ID

    this.client       = new AgarioClient('Bot ' + this.bot_id); //create new client
    this.client.debug = 1; //lets set debug to 1
	
	this.auth_token = null;
}

ExampleBot.prototype = {
    log: function(text) {
        if(this.verbose) {
            console.log(this.bot_id + ' says: ' + text);
        }
    },

    connect: function(server) {
		this.client.auth_token = token;
        this.client.connect(server);
        this.Events();
    },

    Events: function() {
        var bot = this;

        bot.client.on('connected', function() {
            bot.log('Connected, spawning');
            bot.client.spawn(bot.nickname);
            //we will search for target to eat every 100ms
        });

        bot.client.on('connectionError', function(e) {
            bot.log('Connection failed with reason: ' + e);
            bot.log('Server address set to: ' + bot.server + ' key ' + bot.server_key);
        });


        bot.client.on('lostMyBalls', function() {
            bot.log('Lost all my balls, respawning');
            bot.client.spawn(bot.nickname);
        });

        bot.client.on('disconnect', function() {
            bot.log('Disconnected from server, bye!');
        });

        bot.client.on('reset', function() { //when client clears everything (connection lost?)
			console.log("connection lost !");
        });
    }
};


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
	
		if (token == "null") {
			return console.log('no token.');
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
	amount = begginAmount;
	if (debugState == 1) {
		console.log("requesting different FFA servers for Bots...");
		debugState++;
	}
	while (amount !=0 ){
		RequestFFAServer();
		amount--;
		
	}
	if (amount == 0) {
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


