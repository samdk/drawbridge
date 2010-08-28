$(function(){
	function getNewId(){
		return 0; // this should get a new id from the server or something
	}
	$("#variations ul a").click(function(){
		//switch to the variation clicked on
		console.log("clicked");
		return false;
	});
	$("#add").click(function(){
		$("#variations ul").prepend(function(){
			var id = getNewId();
			return '<li><a href="#" id="link'+id+'">'+'<canvas id="var'+id+'" width="120" height="90"></canvas></a></li>'
		});
		return false;
	});

	$("#variations canvas").draggable({opacity: 0.7,
									   revert: true,
									   revertDuration: 100});
	$("#canvas").droppable({
		drop: function(e,ui){ console.log("dropped #"+ui.draggable.attr("id"))}
	});
});
