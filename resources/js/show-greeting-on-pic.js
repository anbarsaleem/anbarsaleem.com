$(document).ready(function() {

    console.log("Script loaded.");
    
    $("#img-with-txt").hover(function(){

        $("#txt").show();
        $("#profile-pic").fadeTo(120, 0.3);

    }, function() {

        $("#txt").hide();
        $("#profile-pic").fadeTo(120, 1);

    });
    
});