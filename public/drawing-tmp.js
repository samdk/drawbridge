$(function(){
	$("#variations canvas").click(function(){
		UI.switch_variation($(this));
	});
	$("#add").click(function(){
		CommLink.requestNewVariation();
	});

	$(".mirror").draggable({opacity: 0.7,revert: true,revertDuration: 200,
							start: function(){UI.start_dragging()},
							stop:  function(){UI.stop_dragging()}})
				.data("rev",getRevisionId());
	$("#canvas-wrap").droppable({
		drop: function(e,ui){
			var rev = ui.draggable.data("rev");
			if (rev != getRevisionId()) {
				CommLink.mergeVariation(rev);
			}
		}
	});
});
