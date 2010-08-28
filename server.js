require.paths.push('/home/node/.node_libraries');
var express = require('express'),
    server = express.createServer(
    	express.logger(),
	express.bodyDecoder()
    ),
    app = require('./app');

server.use(express.staticProvider(__dirname+'/public'));

server.get('/', function(req,res) {
	res.sendfile('/home/node/views/test.html');
});


server.get('/sketch/:id', function(req,res){
	res.sendfile(__dirname+'/public/drawing.html');
});
server.listen(80);
