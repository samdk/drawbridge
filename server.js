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


var rooms = {}, clients = {};

//Setup Socket.IO
var io = io.listen(server);
io.on('connection', function(client){    

	client.on('message', function(message){
	    message = JSON.parse(message);
		switch(message['action']){
			case "user_added":
			    if(rooms[message.sketch_base_id] == undefined)
			        rooms[message.sketch_base_id] = [];
			    var c = rooms[message.sketch_base_id];
			    c.push(client);
			    clients[client.sessionId] = message.sketch_base_id;
			    			    
			    for(x in c)
			        c[x].send(JSON.stringify({action: "add_user", name: message.name}));

                // var user = {name: message.name, email: message.email };
                // var sketch = { id: message.sketch_id };
                // app.addUser(user, sketch, function(userObj) {
                //  client.send({action: "add_user", user: userObj });
                // });
				break;
			case "segment_added":
				var segment = message.segment;
				var sketch = {id: message.sketch_id};
				app.addSegment(sketch, segment, function(segmentObj) {
					client.send({action: "add_segment", segment: segmentObj});
				});
				break;
			case "segment_deleted":
			    break;
			default:
				console.log(message);
				
		}
		//client.broadcast(message);
		//client.send(message);
	});
	
	client.on('disconnect', function(){
	    var sketchId = clients[client.sessionId];
	    delete clients[client.sessionId];
	    for(var x in rooms[sketchId]){
	        if(rooms[x].sessionId == client.sessionId){
	            rooms[x].splice(x, 1);
	            return;
	        }
	    }
	    // app.leaveSketch(client.sessionId, message.sketch_base_id, function(userObj) {
	   //      client.send({action: "sign_off_user", user: userObj});
	   //  });
	});
});


// Routes //
server.get('/', function(req,res) {
	res.sendfile(__dirname+'/public/index.html');
});



server.get('/sketch/:hash?', function(req,res){
	var hash = req.params.hash;
	if (hash){
		res.sendfile(__dirname+'/public/drawing.html');
	}else {
		app.addSketch(function (sketch) {
			res.redirect('/sketch/'+sketch.hash, 302);
		});
	}
});



