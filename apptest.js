var app = require("./app");
console.log(app.getSketch(1, console.log));
app.addSketch(function(hash){
	console.log(hash);
});
