$(function(){
    
    var mouseIsDown = false;
    var selectedColor = "#000000";
    var selectedTool = "pen";
    
    var canvas = $("#canvas").get(0).getContext("2d");
        canvas.lineWidth = 4;
        canvas.lineJoin  = "round";
        canvas.lineCap   = "round";
    
    var canvasOffset = $("#canvas").offset();
    var canvasWidth  = $("#canvas").innerWidth();
    var canvasHeight = $("#canvas").innerHeight();
    
    $("#canvas").get(0).onselectstart = function(){return false;}
        
    var currentSegment;
    var displayedSegments = [];
    
    $("#canvas").mousedown(function(e){
        currentTool().down(e);
    }).mousemove(function(e){
        currentTool().moved(e);
    }).mouseout(function(e){
        currentTool().up(e);
    }).mouseup(function(e){
        currentTool().up(e);
    });
    
    $("#eraser").click(function(){selectedTool = "eraser";});
    $("#pen").click(function(){selectedTool = "pen";});
    
    function currentTool(){
        if(selectedTool == 'pen') return Pencil;
        if(selectedTool == 'eraser') return Eraser;
    }
    
    
    var Pencil = {
        saved : false,
        down : function(e){
            mouseIsDown = true;
            currentSegment = {color: selectedColor, points:[]};
            this.saved = snap();       
        
            canvas.moveTo(xc(e.pageX), yc(e.pageY));
            canvas.beginPath();
            canvas.strokeStyle = canvas.fillStyle = "#cccccc";
        },
    
        moved : function(e){
            if(mouseIsDown){
                canvas.lineTo(xc(e.pageX), yc(e.pageY));
                canvas.stroke();
                currentSegment.points.push([xcr(e.pageX), ycr(e.pageY)]);
            }
            //canvas.save();
            //canvas.restore();
        },
    
        up : function(e){
            mouseIsDown = false;
            if(this.saved)
                unsnap(this.saved);
            segmentWasDrawn(currentSegment);
        }
    };
    
    var Eraser = {
        saved: false,
        down: function(e){},
        moved: function(e){
            var closest = false, dist = 10000000;
            for(var i in displayedSegments){
                if(displayedSegments[i]){
                    for(var j in displayedSegments[i].points){
                        var pt = displayedSegments[i].points[j];
                        
                        var dx = xc(e.pageX) - pt[0]*canvasWidth,
                            dy = yc(e.pageY) - pt[1]*canvasHeight;
                            
                        var curDist = dx*dx + dy*dy;
                        if(dist > curDist){                            
                            dist = curDist;
                            closest = displayedSegments[i];
                        }
                    }
                }
            }
            
            if(!closest || dist > 100){
                if(this.saved)
                    unsnap(this.saved);
                return;
            }
            
            if(!this.saved)
                this.saved = snap();
            
            var oldColor = closest.color;
            closest.color = "#ff0000";
            displaySegment(closest);
            closest.color = oldColor;
        },
        up: function(e){

            
        }
    };
    
    function snap(){
        return canvas.getImageData(0, 0, canvasWidth, canvasHeight);
    }
    function unsnap(img){
        canvas.putImageData(img, 0, 0);
    }
    
    function segmentWasDrawn(seg){
        reportSegment(seg);
        displaySegment(seg);
    }
    
    function reportSegment(seg){
        displayedSegments.push(seg);
    }
    
    function segmentPoll(){
        socket = new io.Socket('localhost');
        socket.connect();
        
        socket.on('message', function(msg){
            msg = eval(msg);
            if(msg.type == 'draw'){
                displaySegment(msg.segment);
                displayedSegments.push(seg);
            }else if(msg.type == 'delete')
                deleteSegment(msg.segment_id);
        });
    }
    
    function displaySegment(seg){
        if(!seg || !seg.points || seg.points.length == 0) return;
        canvas.moveTo(seg.points[0][0] * canvasWidth, seg.points[0][1] * canvasHeight);
        canvas.beginPath();
        for(x in seg.points){
            canvas.lineTo(seg.points[x][0] * canvasWidth, seg.points[x][1] * canvasHeight);
        }
        canvas.strokeStyle = canvas.fillStyle = seg.color;
        canvas.stroke();
    }
    
    function xc(x){ return x - canvasOffset.left; }
    function yc(y){ return y - canvasOffset.top;  }
    function xcr(x) { return xc(x) / canvasWidth;  }
    function ycr(y) { return yc(y) / canvasHeight; }
});