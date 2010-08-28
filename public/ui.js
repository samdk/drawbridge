var UI = {
    canvas : false,
    sign_on_user : function(username){
        var found = false;
        $("#people li").each(function(){
            if($(this).html() == username){
                found = true;
                $(this).removeClass("offline");
            }
        });
        if(!found && username != $("#you form input").val())
            $("#people").append("<li>"+username+"</li>");
    },
    
    sign_off_user : function(username){
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