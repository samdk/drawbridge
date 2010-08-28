$(function(){
    
    var mouseIsDown = false;
    
    var canvas = $("#canvas").get(0).getContext('2d');
    canvas.strokeWidth = 4;
    
    $("#canvas").mousedown(function(e){
        mouseIsDown = true;
        canvas.stroke();
        canvas.moveTo(e.offsetX, e.offsetY);
        canvas.beginPath();
        canvas.strokeStyle = canvas.fillStyle = "#cccccc";
    }).mousemove(function(e){
        if(mouseIsDown){
            canvas.lineTo(e.offsetX, e.offsetY);
            canvas.stroke();
        }
    });
    
    $(document).mouseup(function(e){
        mouseIsDown = false;
        canvas.strokeStyle = canvas.fillStyle = "#000000";
        canvas.stroke();
        canvas.endPath();
    });
});