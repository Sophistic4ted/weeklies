window.onload = function() {
        var time = new Date();
        var hours = time.getHours();
        var minutes = time.getMinutes();
        console.log(hours);
        console.log(minutes);
        if (hours = 24 and minutes < 10) {                
                $(".main").load("inject.html");
        }
}


$(".main").load("inject.html");
