var sys = require('sys');
var gently = new (require('gently'));
var mysql= require('./lib/mysql');
var client = new mysql.Client();

client.host = 'localhost';
client.user = 'sketch-salad';
client.port = 3306;
client.password = 'tri44x';
client.database = 'sketch_salad';

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

