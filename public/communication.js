var CommLink = {
    socket : null, // io.setPath must be called before socket creation for flashsockets

    establish : function(){
        io.setPath("/socket.io/");
		this.socket = new io.Socket(null, {port : window.location.port || 80,
		                                   rememberTransport : false,
										   // flash sockets disabled
										   transports : ['websocket', 'server-events',
														 'htmlfile', 'xhr-multipart',
														 'xhr-polling']});
        this.socket.connect();

        this.socket.on('message', function(msg){
            msg = JSON.parse(msg);
            console.log(msg);
	        if(msg.action == 'add_segment'){
	            if(typeof(msg.segment.points) == 'string') {
	                msg.segment.points = JSON.parse(msg.segment.points);
				}
				var cvs = UI.sketchCanvas(msg.sketch_revision_id);
				if (cvs == undefined) {
					$(".newvar").removeClass("newvar");
					$("#variations ul").prepend('<li><canvas class="newvar"' +
												'width="120" height="90"></canvas></li>');
					UI.variations[msg.sketch_revision_id] = littleCanvas($(".newvar")[0]);
					$(".newvar").draggable({opacity: 0.7,revert: true,revertDuration: 200,
											start: function(){UI.start_dragging()},
											stop:  function(){UI.stop_dragging()}})
								.data("rev",msg.sketch_revision_id)
								.click(function(){UI.switch_variation($(this));});
					cvs = UI.sketchCanvas(msg.sketch_revision_id);
				}
				cvs.addSegment(msg.segment);
                draw_history.addUndoTask({action: "segment_added", 
										  segment: msg.segment, 
										  sketch_revision_id: getRevisionId()});


	            if(getRevisionId() == msg.sketch_revision_id){
                    UI.variations[getRevisionId()].addSegment(msg.segment);
                }
	        }else if(msg.action == 'delete_segment'){
                UI.canvas.deleteSegment(msg.segment_id);
                UI.canvas.refresh();
                UI.variations[getRevisionId()].deleteSegment(msg.segment_id);
                UI.variations[getRevisionId()].refresh();
            }else if(msg.action == 'add_user'){
                UI.sign_on_user(msg);
            }else if(msg.action == 'sign_off_user'){
                UI.sign_off_user(msg);
            }else if(msg.action == 'share_key'){
                UI.updateSharedKey(msg.key);
            }else if(msg.action == 'add_variation'){
				UI.add_variation(msg);
			}
        });
    },
    
    saveImage : function(){
        this.send({
           action: 'save_sketch',
           payload: UI.canvas.canvas.toDataURL() 
        });
    },
    
    reportSegmentDeleted : function(seg, sketchId, undo){
		console.log("reporting deleted");
		console.log(seg);
		if (!undo){
			draw_history.addUndoTask({action: "segment_deleted", segment: seg, sketch_base_id: getBaseId(), sketch_revision_id: getRevisionId()});
		}
        this.send({action             : 'segment_deleted',
                   segment_id         : seg.id,
                   sketch_base_id     : getBaseId(),
                   sketch_revision_id : sketchId});        
    },
    
    reportSegmentDrawn : function(seg, sketchId){
		console.log("reporting added");
		console.log(seg);
        this.send({action             : 'segment_added',
                   segment            : seg,
                   sketch_base_id     : getBaseId(),
                   sketch_revision_id : sketchId});
    },
    
    reportSignOn : function(uname){
        this.send({action            : 'user_added',
                  name               : uname,
                  sketch_base_id     : getBaseId(),
                  sketch_revision_id : getRevisionId()});
    },

	requestNewVariation : function(){
		this.send({action			: 'variation_added',
				   sketch_parent_id	: getRevisionId(),
				   sketch_base_id	: getBaseId()});
	},

	requestSketchReplay : function(){
		this.send({action				: 'sketch_replay_requested',
				   sketch_revision_id	: getRevisionId()});
	},

	mergeVariation : function(topRevId){
		this.send({action				: 'variation_merged',
				   bottom_revision_id	: getRevisionId(),
				   top_revision_id		: topRevId});
	},

    send : function(data){
        this.socket.send(JSON.stringify(data));
    }

};
CommLink.establish();
