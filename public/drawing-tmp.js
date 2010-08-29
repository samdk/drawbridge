$(function(){
	function getNewId(){
		return 0; // this should get a new id from the server or something
	}
	$("#variations ul a").click(function(){
		//switch to the variation clicked on
		var canvas =  $(this).find("canvas"),
			revisionId = canvas.data("rev");
		if (revisionId !== getRevisionId()) {
			window.location.hash = revisionId;
			drawOnCanvas(getRevisionId());
		}
		return false;
	});
	$("#add").click(function(){
		console.log("clicking");
		CommLink.requestNewVariation();
		/*$(".mirror").removeClass("mirror");
		var current = UI.variations[getRevisionId()],
			newVariationId = 10000000;//cloneCurrent(getRevisionId());
		$("#variations ul").prepend(function(){
			return '<li><a href="#"><canvas class="mirror" width="120" height="90"></canvas></a></li>'
		});
		window.location.hash = newVariationId;
		UI.variations[newVariationId] = littleCanvas($(".mirror")[0]);
		$(".mirror").draggable({opacity: 0.7,revert: true,revertDuration: 200})
					.data("rev",newVariationId);
		return false;*/
	});

	$(".mirror").draggable({opacity: 0.7,revert: true,revertDuration: 200})
				.data("rev",getRevisionId());
	$("#canvas-wrap").droppable({
		drop: function(e,ui){ console.log("dropped #"+ui.draggable.attr("id"))}
	});
});
