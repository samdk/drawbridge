var CommLink = {
    socket : new io.Socket(null, {port              : window.location.port || 80,
                                  rememberTransport : false}),

    establish : function(){
        this.socket.connect();

        this.socket.on('message', function(msg){
            msg = JSON.parse(msg);
            console.log(msg);
            if(msg.action == 'add_segment'){
                UI.canvas.displaySegment(msg.segment);
                UI.canvas.segments.push(seg);
            }else if(msg.action == 'delete_segment'){
                UI.canvas.deleteSegment(msg.segment_id);
            }else if(msg.action == 'add_user'){
                UI.sign_on_user(msg.name);
            }else if(msg.action == 'sign_off_user'){
                UI.sign_off_user(msg.name);
            }
        });
    },
    
    reportSegmentDeleted : function(seg_id, sketchId){
        this.send({action: 'segment_deleted', segment_id: seg_id, sketch_id: sketchId});
    },
    
    reportSegmentDrawn : function(seg, sketchId){
        this.send({action: 'segment_added', segment: seg, sketch_id: sketchId});
    },
    
    reportSignOn : function(uname){
        this.send({action: 'user_added', name: uname, sketch_id: getSketchId()});
    },
    
    send : function(data){
        this.socket.send(JSON.stringify(data));
    }
};

CommLink.establish();