var express = require('express'),
    app = express.createServer(),
    db = require('./app')
;

app.get('/', function(req,res) {
	res.send('Test');
});

app.listen();
