$(function(){
	function getNewId(){
		return 0; // this should get a new id from the server or something
	}
	$("#variations ul a").click(function(){
		//switch to the variation clicked on
		var canvas =  $(this).find("canvas");
		window.location.hash = canvas.data("rev");
		drawOnCanvas(getRevisionId());
		return false;
	});
	$("#add").click(function(){
		$(".mirror").removeClass("mirror");
		var current = UI.variations(getRevisionId()),
			newVariationId = cloneCurrent(getRevisionId());
		$("#variations ul").prepend(function(){
			return '<li><a href="#"><canvas class="mirror" width="120" height="90"></canvas></a></li>'
		});
		window.location.hash = newRevisionId;
		UI.variations[newVariationId] = littleCanvas($(".mirror")[0]);
		$(".mirror").draggable({opacity: 0.7,revert: true,revertDuration: 200}).
					.data("rev",newVariationId);
		return false;
	});

	$(".mirror").draggable({opacity: 0.7,revert: true,revertDuration: 200})
				.data("rev",getRevisionId());
	$("#canvas-wrap").droppable({
		drop: function(e,ui){ console.log("dropped #"+ui.draggable.attr("id"))}
	});
});
