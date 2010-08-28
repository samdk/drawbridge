$(function(){
	$("#variations ul a").click(function(){
		//switch to the variation clicked on
		console.log("clicked");
		return false;
	});
	$("#variations canvas").draggable({opacity: 0.7,
									   revert: true,
									   revertDuration: 100});
	$("#canvas").droppable({
		drop: function(e,ui){ console.log("dropped #"+ui.draggable.attr("id"))}
	});
});
