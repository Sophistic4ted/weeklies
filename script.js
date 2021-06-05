window.onload = function() {
        var time = new Date();
        var hours = time.getHours();
        var minutes = time.getMinutes();
        console.log(hours);
        console.log(minutes);
        if (hours == 0 && minutes < 10) {                
                $(".main").load("inject.html");
        }
}


setInterval(() => {
    d = new Date(); //object of date()
    hr = d.getHours();
    min = d.getMinutes();
    sec = d.getSeconds();
    hr_rotation = 30 * hr + min / 2; //converting current time
    min_rotation = 6 * min;
    sec_rotation = 6 * sec;
  
    hour.style.transform = `rotate(${hr_rotation}deg)`;
    minute.style.transform = `rotate(${min_rotation}deg)`;
    second.style.transform = `rotate(${sec_rotation}deg)`;
}, 1000);
