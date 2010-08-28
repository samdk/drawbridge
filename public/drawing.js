$(function(){
    
    var mouseIsDown   = false,
        selectedColor = "#000000",
        selectedTool  = "pen",
        canvasOffset  = $("#canvas").offset(),
        canvasWidth   = $("#canvas").innerWidth(),
        canvasHeight  = $("#canvas").innerHeight();
            
    var canvas = $("#canvas").get(0).getContext("2d");
        canvas.lineWidth = 4;
        canvas.lineJoin  = "round";
        canvas.lineCap   = "round";

    
    $("#canvas").get(0).onselectstart = function(){return false;}

    var displayedSegments = [];
        
    $("#canvas").mousedown(function(e){
        currentTool().down(e);
		fadeInShadow();
    }).mousemove(function(e){
        currentTool().moved(e);
    }).mouseout(function(e){
        currentTool().up(e);
    }).mouseup(function(e){
        currentTool().up(e);
    }).mouseover(function(e){
		fadeInShadow(e);
	}).mouseleave(function(){
		fadeOutShadow();
	});
    
    $("#eraser").click(function(){
        selectedTool = "eraser";
        $("#pen").removeClass("selected");
        $(this).addClass("selected");
    });
    $("#pen").click(function(){
        selectedTool = "pen";
        $("#eraser").removeClass("selected");
        $(this).addClass("selected");
    });
    
    function currentTool(){
        if(selectedTool == 'pen')    return Pencil;
        if(selectedTool == 'eraser') return Eraser;
    }    
    
    var Pencil = {
        saved : false,
        currentSegment : false,
        down : function(e){
            mouseIsDown = true;
            this.currentSegment = {color: selectedColor, points:[[xcr(e.pageX), ycr(e.pageY)]]};
            this.saved = snap();    
        
            canvas.moveTo(xc(e.pageX), yc(e.pageY));
            canvas.beginPath();
            canvas.lineTo(xc(e.pageX), yc(e.pageY));
            canvas.stroke();
            canvas.strokeStyle = canvas.fillStyle = "#cccccc";
        },
    
        moved : function(e){
            if(mouseIsDown){
                canvas.lineTo(xc(e.pageX), yc(e.pageY));
                canvas.stroke();
                this.currentSegment.points.push([xcr(e.pageX), ycr(e.pageY)]);
                canvas.save(); canvas.restore();
            }
        },
    
        up : function(e){
            mouseIsDown = false;
            if(this.saved){
                unsnap(this.saved);
                this.saved = false;
            }
            if(this.currentSegment){
                CommLink.reportSegmentDrawn(this.currentSegment);
                this.currentSegment = false;
            }
        }
    };
    
    var Eraser = {
        saved: false,
        id: false,
        down: function(e){},
        moved: function(e){
            this.closest = false;
            var dist = 10000000, lastPt = false;
            for(var i in displayedSegments){
                if(displayedSegments[i]){
                    for(var j in displayedSegments[i].points){
                        var a = displayedSegments[i].points[j];
                        var b = lastPt || [a[0]+0.0001, a[1]+0.0001];
                        
                        var px = b[0] - a[0],
                            py = b[1] - a[1];
                                                    
                        var u = ((xcr(e.pageX) - a[0]) * px +
                                 (ycr(e.pageY) - a[1]) * py) / (px*px + py*py);

                        if(u > 1)       u = 1;
                        else if(u < 0)  u = 0;

                        var x = a[0] + u * px,
                            y = a[1] + u * py;

                        var dx = x - xcr(e.pageX),
                            dy = y - ycr(e.pageY);

                        var curDist = dx*dx + dy*dy;
                        
                        if(dist > curDist){           
                            dist = curDist;
                            this.closest = displayedSegments[i];
                        }
                                                
                        lastPt = a;
                    }
                }
            }            
            
            if(this.saved){
                unsnap(this.saved);
            }
            
            if(!this.closest || dist > 0.0005){
                this.closest = false;
                return;
            }
            
            
            if(!this.saved)
                this.saved = snap();
            
            var oldColor = this.closest.color;
            this.closest.color = "#ff0000";
            displaySegment(this.closest);
            this.closest.color = oldColor;
        },
        up: function(e){
            if(this.closest){
                CommLink.reportSegmentDeleted(deleteSegment(this.closest.id));
                this.closest = false;
                this.saved = false;
                refresh();
            }
        }
    };
    
    function snap(){
        return canvas.getImageData(0, 0, canvasWidth, canvasHeight);
    }
    function unsnap(img){
        canvas.putImageData(img, 0, 0);
    }
    
    function refresh(){
        unsnap(canvas.createImageData(canvasWidth, canvasHeight));
        for(var i in displayedSegments)
            displaySegment(displayedSegments[i]);
    }
    
    var CommLink = {
        socket : new io.Socket(null, {port: 8008, rememberTransport: false}),
        
        establish : function(){
            this.socket.connect();

            this.socket.on('message', function(msg){
                msg = JSON.parse(msg);
                console.log(msg);
                if(msg.action == 'add_segment'){
                    segmentAdded(msg.segment);
                }else if(msg.action == 'delete_segment'){
                    deleteSegment(msg.segment_id);
                }else if(msg.action == 'add_user'){
                    sign_on_user(msg.name);
                }else if(msg.action == 'sign_off_user'){
                    sign_off_user(msg.name);
                }
            });
        },
        
        reportSegmentDeleted : function(seg_id){
            this.send({action: 'delete_segment', segment_id: seg_id, sketch_id: getSketchId()});
        },
        
        reportSegmentDrawn : function(seg){
            this.send({action: 'segment_added', segment: seg, sketch_id: getSketchId()});
        },
        
        reportSignOn : function(uname){
            this.send({action: 'user_added', name: uname, sketch_id: getSketchId()});
        },
        
        send : function(data){
            this.socket.send(JSON.stringify(data));
        }
    };
    
    CommLink.establish();
    
    function segmentAdded(seg){
        displaySegment(seg);
        displayedSegments.push(seg);
    }
    
    function sign_on_user(username){
        var found = false;
        $("#people li").each(function(){
            if($(this).html() == username){
                found = true;
                $(this).removeClass("offline");
            }
        });
        if(!found && username != $("#you form input").val())
            $("#people").append("<li>"+username+"</li>");
    }
    
    function sign_off_user(username){
        $("#people li").each(function(){
            if($(this).html() == username){
                $(this).addClass("offline");
            }
        });
    }
    
    function displaySegment(seg){
        if(!seg || !seg.points || seg.points.length == 0){
            return;
        }else if(seg.points.length == 1){
            canvas.save();
            canvas.beginPath();
            canvas.arc(seg.points[0][0] * canvasWidth,
                       seg.points[0][1] * canvasHeight,
                       4, 0, Math.PI * 2, true);
            canvas.closePath();
            canvas.strokeStyle = canvas.fillStyle = seg.color;
            canvas.fill();
            canvas.restore();
        }else{
            canvas.moveTo(seg.points[0][0] * canvasWidth, seg.points[0][1] * canvasHeight);
            canvas.beginPath();
            for(x in seg.points){
                canvas.lineTo(seg.points[x][0] * canvasWidth, seg.points[x][1] * canvasHeight);
            }
            canvas.strokeStyle = canvas.fillStyle = seg.color;
            canvas.stroke();
        }
    }
    
    function deleteSegment(seg_id){
       for(x in displayedSegments){
           if(displayedSegments[x].id == seg_id){
               return displayedSegments.splice(x, 1);
           }
       }
    }
    
    function xc(x){ return x - canvasOffset.left; }
    function yc(y){ return y - canvasOffset.top;  }
    function xcr(x) { return xc(x) / canvasWidth;  }
    function ycr(y) { return yc(y) / canvasHeight; }

	function getSketchId(){
	    return window.location.hash.substring(1);
	}

	var doFade = false;
	function fadeInShadow(){
		doFade = true;
		setTimeout(function(){
			if (doFade){
				$("#shadow").fadeIn(200);
			}
		},200);
	}
	function fadeOutShadow(){
		doFade = false;
		$("#shadow").fadeOut(150);
	}

	$("#share").click(function(){
		if ($("#share-box").css("display") === "none") {
			$("#share-box").show();
		} else {
			$("#share-box").hide();
		}
		return false;
	});
	$("#share-box .close").click(function(){ $("#share-box").hide(); return false; });
	$("#invite").click(function(){
		if ($("#invite-box").css("display") === "none") {
			$("#invite-box").css("top",$("#invite").position().top + 48)
			$("#invite-box").show();
		} else {
			$("#invite-box").hide();
		}
		return false;
	});
	$("#invite-box .close").click(function(){ $("#invite-box").hide(); return false; });

	$("#you a").click(function(){
		$("#you form").show();
		$("#you a").hide();
		$("#you form input").focus();
	});
	$("#you form input").focusout(function(){
		$("#you a").html($("#you form input").val()  + " <span class='tiny'>(click to change)</span>");
		$("#you a").show();
		$("#you form").hide();
	});
	$("#you form").submit(function(){
        CommLink.reportSignOn($("#you form input").val());
        $("#you form input").focusout();
        return false;
	});
});
