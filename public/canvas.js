function Canvas(ref){
    ref.onselectstart = function(){ return false; }
    this.canvas   = ref;
    this.context  = ref.getContext('2d');
    this.width    = $(ref).innerWidth();
    this.height   = $(ref).innerHeight();
    this.segments = [];
    this.pen      = new Pen(this);
    this.eraser   = new Eraser(this);
    this.ptRadius = 4;
    this.sketchId = getRevisionId();
    
    this.snap   = function(){ return this.context.getImageData(0, 0, this.width, this.height); };
    this.unsnap = function(img){     this.context.putImageData(img, 0, 0); };
    
    this.refresh = function(){
        this.unsnap(context.createImageData(this.width, this.height));
        for(var i in this.segments)
            this.displaySegment(segments[i]);
    }

    this.displaySegment = function(seg){
        if(!seg || !seg.points || seg.points.length == 0){
            return;
        }else if(seg.points.length == 1){
            ctx.save();
            ctx.beginPath();
            ctx.arc(this.cx(seg.points[0][0]), this.cy(seg.points[0][1]), this.ptRadius, 0, Math.PI * 2, true);
            ctx.closePath();
            ctx.strokeStyle = ctx.fillStyle = seg.color;
            ctx.fill();
            ctx.restore();
        }else{
            ctx.moveTo(this.cx(seg.points[0][0]), this.cy(seg.points[0][1]));
            ctx.beginPath();
            for(x in seg.points){
                ctx.lineTo(this.cx(seg.points[x][0]), this.cy(seg.points[x][1]));
            }
            ctx.strokeStyle = ctx.fillStyle = seg.color;
            ctx.stroke();
        }
    }
    
    this.deleteSegment = function(segId){
        for(x in this.segments)
            if(this.segments[x].id == segId)
                return this.segments.splice(x, 1);
    }

    this.xc  = function(x){ return x - $(this.canvas).offset().left; }
    this.yc  = function(y){ return y - $(this.canvas).offset().top;  }
    this.xcr = function(x){ return this.xc(x) / this.width;  }
    this.ycr = function(y){ return this.yc(y) / this.height; }
    this.cx  = function(x){ return x * this.width;  };
    this.cy  = function(y){ return y * this.height; };

};

function Pen(canvas){
    this.canvas         = canvas;
    this.isDrawing      = false;
    this.saved          = false;
    this.currentSegment = false;
    this.color          = "#000000";
    this.tmp_color      = "#cccccc";

    
    this.down = function(x, y){
        this.isDrawing      = true;
        this.currentSegment = {color: this.color, points:[[x,y]]};
        this.saved = this.canvas.snap();
        
        ctx = this.canvas.context;
        ctx.moveTo(this.canvas.cx(x), this.canvas.cy(y));
        ctx.beginPath();
        ctx.lineTo(this.canvas.cx(x), this.canvas.cy(y));
        ctx.stroke();
        ctx.strokeStyle = ctx.fillStyle = this.tmp_color;
    };
    
    this.moved = function(x, y){
        if(this.isDrawing){
            ctx = this.canvas.context;
            
            ctx.lineTo(this.canvas.cx(x), this.canvas.cy(y));
            ctx.stroke();
            this.currentSegment.points.push([x, y]);
            ctx.save(); ctx.restore();   
        }
    };
    
    this.up = function(x, y){
        this.isDrawing = false;
        if(this.saved){
            this.canvas.unsnap(this.saved);
            this.saved = false;
        }
        if(this.currentSegment){
            CommLink.reportSegmentDrawn(this.currentSegment, this.canvas.sketchId);
            this.currentSegment = false;
        }
    }
}

function Eraser(canvas){
    this.canvas  = canvas;
    this.saved   = false;
    this.closest = false;
    this.highlightColor = "#ff0000";
    
    this.down   = function(){};
    this.moved  = function(x, y){
        this.closest = false;
        var dist = 10000000, lastPt = false;
        for(var i in this.canvas.segments){
            if(this.canvas.segments[i]){
                var seg = this.canvas.segments[i];
                for(var j in seg.points){
                    var a = seg.points[j],
                        b = lastPt || [a[0]+0.00001, a[1]+0.00001],
                        px = b[0] - a[0], py = b[1] - a[1],
                        u = ((xcr(e.pageX) - a[0]) * px +
                             (ycr(e.pageY) - a[1]) * py) / (px*px + py*py);

                    if(u > 1)       u = 1;
                    else if(u < 0)  u = 0;

                    var dx = a[0] + u * px - x,
                        dy = a[1] + u * py - y;

                    var curDist = dx*dx + dy*dy;
                    
                    if(dist > curDist){           
                        dist = curDist;
                        this.closest = seg;
                    }
                                            
                    lastPt = a;
                }
            }
        }            
        
        if(this.saved)
            unsnap(this.saved);
        
        if(!this.closest || dist > 0.0005){
            this.closest = false;
            return;
        }
        
        
        if(!this.saved)
            this.saved = snap();
        
        var oldColor = this.closest.color;
        this.closest.color = this.highlightColor;
        this.canvas.displaySegment(this.closest);
        this.closest.color = oldColor;  
    };
    
    this.up = function(x, y){
        if(this.closest){
            CommLink.reportSegmentDeleted(deleteSegment(this.closest.id), this.canvas.sketchId);
            this.closest = false;
            this.saved = false;
            this.canvas.refresh();
        }
    };
}
