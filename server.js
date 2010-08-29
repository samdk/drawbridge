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

port = parseInt(process.argv[2] || 80);
console.log("listening on port "+port);
server.listen(port);


var rooms = {}, clients = {};

//Setup Socket.IO
var io = io.listen(server);
io.on('connection', function(client){    

	client.on('message', function(message){
	    message = JSON.parse(message);
	    	console.log(message);
		switch(message['action']){
			case "user_added":
			    if(rooms[message.sketch_base_id] == undefined)
			        rooms[message.sketch_base_id] = [];
			    var c = rooms[message.sketch_base_id];
			    c.push(client);
			    
			    var isNew = clients[client.sessionId] == undefined;
			        
			    clients[client.sessionId] = message.sketch_base_id;
			    			    			    
			    for(x in c){
			        c[x].send(JSON.stringify({action: "add_user",
			                                  name  : message.name,
			                                  id    : app.sha1(client.sessionId)}));
			        if(isNew && x != c.length-1){
			            c[c.length-1].send(JSON.stringify({
			                action  : "add_user",
			                name    : message.name,
			                id      : app.sha1(c[x].sessionId)
			            }));
			        }
			    }

                // var user = {name: message.name, email: message.email };
                // var sketch = { id: message.sketch_id };
                // app.addUser(user, sketch, function(userObj) {
                //  client.send({action: "add_user", user: userObj });
                // });
				break;
			case "segment_added":
				var segment = message.segment;
				var sketch = {base_id: message.sketch_base_id, revision_id: message.sketch_revision_id};
				app.addSegment(sketch, segment, function(segmentObj) {
					c = rooms[message.sketch_base_id];
					for (x  in c ){
						c[x].send(JSON.stringify({action: "add_segment", 
									  segment: segmentObj}));
					}
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
	        if(rooms[sketchId][x].sessionId == client.sessionId){
	            rooms[sketchId].splice(x, 1);
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

server.get('/view/:hash?', function (req, res) {
	var hash = req.params.hash;
	if (hash){
		res.sendfile(__dirname+'/public/view.html');
	} else {
		res.redirect('/sketch',302);
	}
});


