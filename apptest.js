var app = require("./app");
//console.log(app.getSketch(1, console.log));
/*app.addSketch(function(hash){
	console.log(hash);
});*/

/*app.addUser({name: "test"+Math.floor(Math.random()*1001), email: ''}, {id: 1}, 
	function(userId){
		console.log(userId);
	});*/

app.getSketchIdFromHash("a15e74b1d251ec868be1def9dd78c46c4ff9b85a", console.log);
