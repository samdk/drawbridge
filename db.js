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

//var conn = new mysql.Connection('localhost', 'sketch-salad', 'tri44x', 'sketch_salad');

client.connect();



client.query('select * from sketch', 
	gently.expect(function selectCb(err, results, fields){
		if (err){
			throw err;
		}
		console.log(results);
	})
);

