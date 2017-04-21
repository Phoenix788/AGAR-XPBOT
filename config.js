
// ----- CONFIG -----

module.exports = {

amount: 450, // MAX Amount of bots
restartTimer : 30, // Restart Timeout in mins..  Set to 0 for no restart
accNumber: 1,  // Which account to use
regions: ["BR-Brazil", "CN-China", "EU-London", "JP-Tokyo", "RU-Russia", "SG-Singapore", "TK-Turkey", "US-Atlanta"],
accountsArr: [
	{c_user: "YOUR_C_USER_1", datr: "YOUR_DATR_1", xs: "YOUR_XS_1"},
	{c_user: "YOUR_C_USER_2", datr: "YOUR_DATR_2", xs: "YOUR_XS_2"},
	{c_user: "YOUR_C_USER_3", datr: "YOUR_DATR_3", xs: "YOUR_XS_3"},
],
tokenRefresh: 5, // Time to refresh fb token in mins
botsName: 'AGAR-XPBOT', // Bots name
debug: 0 // Set to 1 for debugging

}

// ------------------
