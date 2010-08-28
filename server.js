require.paths.push('/home/node/.node_libraries');
var express = require('express'),
    server = express.createServer();

server.get('/', function(req,res) {
	res.send('Test');
});

server.listen();
