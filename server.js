require.paths.push('/home/node/.node_libraries');
var sys = require('sys'),
    exec = require('child_process').exec,
    express = require('express'), 
    server = express.createServer(
    	express.logger(),
	express.bodyDecoder()
    ),
    app = require('./app'),
    io = require('./lib/socket.io-node/lib/socket.io')
    ;

server.use(express.staticProvider(__dirname+'/public'));

server.get('/', function(req,res) {
	res.sendfile('/home/node/views/test.html');
});



server.get('/sketch/:id', function(req,res){
	res.sendfile(__dirname+'/public/drawing.html');
});

exec ("hostname", function (error, stdout, stderr) {
	if (stdout === "team-hyphen"){
		server.listen(80);
	}else {
		server.listen(8000);
	}
});
