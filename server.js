require.paths.push('/home/node/.node_libraries');
var express = require('express'),
    server = express.createServer(
    	express.logger(),
	express.bodyDecoder()
    ),
    app = require('./app');

server.get('/', function(req,res) {
	res.sendfile('test.html');
});

server.get('/drawing', function(req,res){
	res.render('./public/drawing.html');
});

server.listen(80);
