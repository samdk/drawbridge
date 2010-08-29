var UI = {
    canvas : false,
    sign_on_user : function(user){
        var found = false;
        console.log("Sign on user", user);
        $("#people ul li").each(function(){
            console.log("uuid", $(this).data("uuid"));
            if($(this).data("uuid") == user.id){
                found = true;
                $(this).removeClass("offline");
            }
        });
        if(!found){
            $("#people ul").append("<li>"+user.name+"</li>");
            $("#people ul li:last").data("uuid", user.id);            
        }
            
        $("#people h2").text(
            ($("#people li").length-1) +
            ($("#people li").length == 2 ? ' person ' : ' people ') +
            'drawing'
        );
    },
    
    sign_off_user : function(user){
        $("#people li").each(function(){
            if($(this).html() == username){
                $(this).addClass("offline");
            }
        });
    },
    
    doFade : false,
	
	fadeInShadow : function(){
		this.doFade = true;
        var me = this;
		setTimeout(function(){me.doFade && $("#shadow").fadeIn(200)}, 200);
	},
	
	fadeOutShadow : function(){
		this.doFade = false;    
		$("#shadow").fadeOut(150);
	}
}