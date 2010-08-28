var app = require("./app");
//console.log(app.getSketch(1, console.log));
/*app.addSketch(function(hash){
	console.log(hash);
});*/

app.addUser({name: "test"+Math.floor(Math.random()*1001), email: ''}, {id: 1}, 
	function(userId){
		console.log(userId);
	});
