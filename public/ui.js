var UI = {
    canvas : false,
    variations : {},
	currentTool: null,
    
    sketchCanvas : function(sketchId){
        if(sketchId == getRevisionId())
            return this.canvas;
		if (this.variations[sketchId] != undefined) {
			return this.variations[sketchId];
		}else {
			
		}
    },
    
    updateSharedKey : function(k){
        $("#share-box input").val("http://" + document.location.host + "/view/" + k);  
    },
    
    sign_on_user : function(user){
        var found = false;
        
        if(user.me)
            return;
        
        $("#people ul li").each(function(){
            if($(this).data("uuid") == user.id){
                found = true;
                $(this).text(user.name);
            }
        });
        
        if(!found){
            $("<li></li>").appendTo($("#people ul")).text(user.name).data("uuid", user.id);
        }
                    
        $("#people h2").text(
            $("#people ul li").length +
            ($("#people li").length == 1 ? ' person ' : ' people ') +
            'drawing'
        );
    },
    
    sign_off_user : function(user){
        $("#people li").each(function(){
            if($(this).data("uuid") == user.id){
                $(this).remove();
            }
        });
        $("#people h2").text(
            $("#people ul li").length +
            ($("#people li").length == 1 ? ' person ' : ' people ') +
            'drawing'
        );
    },

	add_variation : function(sketch){
		$(".mirror").removeClass("mirror");
		var current = UI.variations[getRevisionId()],
			newVariationId = sketch.sketch_revision_id;
		$(".activefork").removeClass("activefork");
		$("#variations ul").prepend('<li><canvas class="mirror activefork"' +
									'width="120" height="90"></canvas></li>');
		window.location.hash = newVariationId;
		UI.canvas = new Canvas($("#canvas").get(0));
		UI.canvas.context.lineWidth = 4;
		UI.canvas.context.lineJoin  = "round";
		UI.canvas.context.lineCap   = "round";
		$("#eraser").removeClass("selected");
        $("#pen").addClass("selected");
		UI.currentTool = UI.canvas.pen;
		UI.variations[newVariationId] = littleCanvas($(".mirror")[0]);
		$(".mirror").draggable({opacity: 0.7,revert: true,revertDuration: 200,
							start: function(){UI.start_dragging()},
							stop:  function(){UI.stop_dragging()}})
					.data("rev",newVariationId)
					.click(function(){UI.switch_variation($(this));});

	},

	switch_variation : function(canvas){
		var revisionId = canvas.data("rev");
		$(".activefork").removeClass("activefork");
		$(canvas).addClass("activefork");
		if (revisionId != getRevisionId()) {
			if (revisionId == undefined) {
				window.location.hash = '';
			} else {
				window.location.hash = revisionId;
			}
			UI.canvas = new Canvas($("#canvas").get(0));
			UI.canvas.context.lineWidth = 4;
			UI.canvas.context.lineJoin  = "round";
			UI.canvas.context.lineCap   = "round";
			$("#eraser").removeClass("selected");
			$("#pen").addClass("selected");
			UI.currentTool = UI.canvas.pen;
			//UI.canvas.context.clearRect(0,0,UI.canvas.width,UI.canvas.height);
			UI.canvas.segments = [];
            UI.variations[getRevisionId()].segments = [];
			UI.canvas.context.clearRect(0,0,UI.canvas.width,UI.canvas.height);
			CommLink.requestSketchReplay();
		}
		return false;
	},

	start_dragging : function() { $(".shadow").show(); },
	stop_dragging  : function() { $(".shadow").hide(); }
}
