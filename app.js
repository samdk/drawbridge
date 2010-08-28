var database = require('./config').database;
var sys = require('sys');
var gently = new (require('gently'));
var mysql= require('./lib/mysql');
var client = new mysql.Client();

client.host = database.host;
client.user = database.username;
client.port = database.port;
client.password = database.password;
client.database = database.name;


client.connect();
exports.Sketch = function (id){
	
	getSketch = function (id){
		client.query("select * from sketch where id = " + id, 
			function selectCb(err, results, fields){
				if (err){
					throw err;
				}
				if (results.length ===1) {
					return results[0];
				}
			}
		);

	}

}
	

	





