window.onload = function() {
        var time = new Date();
        var hours = time.getHours();
        var minutes = time.getMinutes();
        console.log(typeof(hours));
        console.log(minutes);
        $(".main").load("inject.html");
}


$(".main").load("inject.html");
