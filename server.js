require.paths.push('/home/node/.node_libraries');
var sys = require('sys'),
    exec = require('child_process').exec,
    express = require('express'), 
    server = express.createServer(
    	express.logger(),
	express.bodyDecoder()
    ),
    app = require('./app'),
    io = require('socket.io');

server.use(express.staticProvider(__dirname+'/public'));

port = (process.argv[2]=== undefined)?80:parseInt(process.argv[2]);
console.log("listening on port "+port);
server.listen(port);

//Setup Socket.IO
var io = io.listen(server);
io.on('connection', function(client){
	console.log('Client Connected');
	client.on('message', function(message){
		switch(message.action){
			case "user_added":
				var user = {name: message.name, email: message.email };
				var sketch = { id: message.sketch_id };
				app.addUser(user, sketch, function(userObj) {
					client.send(action: "add_user", user: userObj );
				});
			default:
				console.log(message);
				
		}
		//console.log(message);
		//client.broadcast(message);
		//client.send(message);
	});
		client.on('disconnect', function(){
		console.log('Client Disconnected.');
	});
});


// Routes //
server.get('/', function(req,res) {
	res.sendfile(__dirname+'/public/index.html');
});



server.get('/sketch/:id', function(req,res){
	res.sendfile(__dirname+'/public/drawing.html');
});



