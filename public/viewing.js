function getRevisionId(){}

$(function(){
        
    var c = new Canvas($('<canvas width="640" height="480"></canvas>').appendTo($('body')).css({
        position: 'absolute',
        left: '-1000px',
        bottom: '1000px'
    }).get(0));
    
    $.get('/viewdata/'+window.location.pathname.split("/").pop(), function(msg){
        msg = JSON.parse(msg);
        for(x in msg){
            if(typeof(msg[x].points) == 'string')
                msg[x].points = JSON.parse(msg.points);
            c.addSegment(msg[x]);
        }
        $("#canvas-view").attr('src', c.canvas.toDataURL('image/png'));
        
    });
    
});


