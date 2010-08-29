var UI = {
    canvas : false,
    sign_on_user : function(user){
        var found = false;

        $("#people ul li").each(function(){
            if($(this).data("uuid") == user.id){
                found = true;
                $(this).removeClass("offline");
                $(this).text(user.name);
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
    }
}
