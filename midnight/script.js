window.onload = function () {
    $(".se-pre-con").fadeOut("slow");
  };
  
  setInterval(() => {
    d = new Date(); //object of date()
    hr = d.getHours();
    min = d.getMinutes();

    if (!(hr == 0 && min < 10)) {
      window.location = "../intro/intro.html"
    }
  }, 1000);
  
  