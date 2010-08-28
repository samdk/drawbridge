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
	client.query ("INSERT INTO sketch (hash,created_at,modified_at) values ('', NULL, NULL)",function selectCb(err, results, fields){
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


exports.addUser = function(user,sketch,runFunction) {
	client.query("INSERT INTO user(name,email) values (?, ?)", [user.name, user.email], function selectCb(err, results, fields) {
		if (err){
			throw err;
		}
		var userId = results.insertId;
		client.query("INSERT INTO user_to_sketch (user_id, sketch_id) values (?, ?)", [userId, sketch.id], function (err,results, fields){
			if (err){
				throw err;
			}
			var userObj = {id: userId, name: user.name, email: user.emai};
			runFunction(userObj);
		});
	});
}


exports.leaveSketch = function(user, sketch, runFunction) {
	client.query ("UPDATE user_to_sketch SET is_active = 0 WHERE user_id = ? AND sketch_id = ?", [user.id, sketch.id], function (err, results, fields) {
		if (err){
			throw err;
		}
		runFunction(user.id);
	});
}
