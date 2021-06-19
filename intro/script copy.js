window.onload = function () {
  $(".se-pre-con").fadeOut("slow");
};

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

  if (hr == 0 && min < 10) {
    window.location.reload(); 
    const container = document.getElementById("container");
    container.innerHTML = "";
    $("#container").load("inject.html");
  }
}, 1000);

$(function () {
  var container = $("#colorsContainer");
  container.on("mousemove", function (e) {
    var x = e.clientX - $(this).offset().left + $(window).scrollLeft();
    var y = e.clientY - $(this).offset().top + $(window).scrollTop();

    var rY = map(x, 0, $(this).width(), -17, 17);
    var rX = map(y, 0, $(this).height(), -17, 17);

    $(this)
      .children("#clockBackground")
      .css(
        "transform",
        "rotateY(" + rY + "deg)" + " " + "rotateX(" + -rX + "deg)"
      );
  });

  container.on("mouseenter", function () {
    $(this)
      .children("#clockBackground")
      .css({
        transition: "all " + 0.05 + "s" + " linear",
      });
  });

  container.on("mouseleave", function () {
    $(this)
      .children("#clockBackground")
      .css({
        transition: "all " + 0.2 + "s" + " linear",
      });

    $(this)
      .children("#clockBackground")
      .css(
        "transform",
        "rotateY(" + 0 + "deg)" + " " + "rotateX(" + 0 + "deg)"
      );
  });

  function map(x, in_min, in_max, out_min, out_max) {
    return ((x - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min;
  }
});
