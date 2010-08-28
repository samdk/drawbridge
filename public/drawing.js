$(function(){
    
    var mouseIsDown = false;
    var selectedColor = "#000000";
    var selectedTool = "pencil";
    
    var canvas = $("#canvas").get(0).getContext("2d");
        canvas.lineWidth = 4;
        canvas.lineJoin = "round";
        canvas.lineCap = "round";
    
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
    }).mouseout(function(){
        currentTool().up();
    }).mouseup(function(e){
        currentTool().up();
    });
    
    function currentTool(){
        if(selectedTool == 'pencil') return Pencil;
        if(selectedTool == 'eraser') return Eraser;
    }
    
    
    var Pencil = {
        down : function(e){
            mouseIsDown = true;
            currentSegment = {color: selectedColor, points:[]};
            canvas.save();        
        
            canvas.moveTo(xc(e.pageX), yc(e.pageY));
            canvas.beginPath();
            canvas.strokeStyle = canvas.fillStyle = "#cccccc";
        },
    
        moved : function(e){
            if(mouseIsDown){
                canvas.lineTo(xc(e.pageX), yc(e.pageY));
                canvas.stroke();
                currentSegment.points.push([xc(e.pageX)/canvasWidth,
                                            yc(e.pageY)/canvasHeight]);
            }else{
                //checkIfSegmentSelected();
            }
            canvas.save();
            canvas.restore();
        },
    
        up : function(){
            mouseIsDown = false;
            canvas.restore();
            segmentWasDrawn(currentSegment);
        }
    };
    
    var Eraser = {};
    
    function segmentWasDrawn(seg){
        reportSegment(seg);
        displaySegment(seg);
    }
    
    function reportSegment(seg){}
    
    function segmentPoll(){
        socket = new io.Socket('localhost');
        socket.connect();
        
        socket.on('message', function(msg){
            msg = eval(msg);
            if(msg.type == 'draw')
                displaySegment(msg.segment);
            else if(msg.type == 'delete')
                deleteSegment(msg.segment_id);
        });
    }
    
    function displaySegment(seg){
        if(seg.points.length == 0) return;
        canvas.moveTo(seg.points[0][0] * canvasWidth, seg.points[0][1] * canvasHeight);
        canvas.beginPath();
        for(x in seg.points){
            canvas.lineTo(seg.points[x][0] * canvasWidth, seg.points[x][1] * canvasHeight);
        }
        canvas.strokeStyle = canvas.fillStyle = seg.color;
        canvas.stroke();
        displayedSegments.push(seg);
    }
    
    function xc(x){ return x - canvasOffset.left; }
    function yc(y){ return y - canvasOffset.top;  }
});