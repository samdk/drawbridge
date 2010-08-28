require.paths.push('/home/node/.node_libraries');
var sys = require('sys'),
    exec = require('child_process').exec,
    express = require('express'), 
    server = express.createServer(
    	express.logger(),
	express.bodyDecoder()
    ),
    //app = require('./app'),
    io = require('socket.io');

server.use(express.staticProvider(__dirname+'/public'));

server.get('/', function(req,res) {
	res.sendfile(__dirname+'/public/index.html');
});



server.get('/sketch/:id', function(req,res){
	res.sendfile(__dirname+'/public/drawing.html');
});


port = (process.argv[2]=== undefined)?80:parseInt(process.argv[2]);
console.log(port);
server.listen(port);
