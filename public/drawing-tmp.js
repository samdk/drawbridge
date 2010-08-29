$(function(){
	function getNewId(){
		return 0; // this should get a new id from the server or something
	}
	$("#variations canvas").click(function(){ UI.switch_variation($(this)); });
	$("#add").click(function(){
		CommLink.requestNewVariation();
	});

	$(".mirror").draggable({opacity: 0.7,revert: true,revertDuration: 200})
				.data("rev",getRevisionId());
	$("#canvas-wrap").droppable({
		drop: function(e,ui){ console.log("dropped #"+ui.draggable.attr("id"))}
	});
});
