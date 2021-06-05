window.onload = function() {
        var time = Date.now();
        var hours = time.getHours();
        var minutes = time.getMinutes();
        console.log(hours);
        console.log(minutes);
        $(".main").load("inject.html");
}


$(".main").load("inject.html");
