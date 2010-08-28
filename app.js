var database = require('./config').database;
var secret_key = "test";
var sys = require('sys');
var gently = new (require('gently'));
var mysql= require('./lib/mysql');
var crypto = require ('crypto'); //node.js needs to be compiled with openssl support
var client = new mysql.Client();

client.host = database.host;
client.user = database.username;
client.port = database.port;
client.password = database.password;
client.database = database.name;


client.connect();
exports.getSketch = function (id, runFunction){
		client.query("select * from sketch where id = " + id, 
			function selectCb(err, results, fields){
				if (err){
					throw err;
				}
				if (results.length ===1) {
					runFunction(results);	
				}
			}
		);

};

exports.addSketch = function (runFunction){
	client.query ("INSERT INTO sketch values (NULL, '', NULL, NULL)",function selectCb(err, results, fields){
		if (err){
			throw err;
		}
		var insertId = results.insertId;
		var hash = crypto.createHash("sha1").update(insertId+secret_key).digest("hex");
		client.query("UPDATE sketch SET hash=? WHERE id=?", [hash, insertId], 
		function selectCb(err, results, fields){
			if (err){
				throw err;
			}
			runFunction(hash);
			//console.log(results);
		}
		);

});
}
