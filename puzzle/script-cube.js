var scene = document.getElementById("scene");
var parallaxInstance = new Parallax(scene);

$(document).ready(function () {
  $(".center").delay(500).fadeIn(500);
  $(".smallface").delay(1000).fadeIn(500);
  $(".bigface").delay(2000).fadeIn(500);
  $(".front").delay(3000).fadeIn(100);
  $(".top").delay(3100).fadeIn(100);
  $(".left").delay(3200).fadeIn(100);
  $(".right").delay(3300).fadeIn(100);
  $(".bottom").delay(3400).fadeIn(100);
  $(".back").delay(3500).fadeIn(100);
});

// Global variable
let defaultPerspective = "-150px";
// const pageX = window.screen.width;
// const pageY = window.screen.height;
// Track the mouse movemont
let clicked = 0;
let mouseX = 0;
let mouseY = 0;
let lastXDeg = 180;
let lastYDeg = 180;
// The speed of the cube following movement
const speed = 0.1;

$(document).ready(() => {
  drawContent();
  setInterval(rotateCube, 66);
});

$(document).mousemove(updateMousePosition);

// Set inner heml for face
function drawContent() {
  $(".face").html(`
    <div class='face'></div> 
 `);
}

// Follow mouse movement
function updateMousePosition(e) {
  mouseX = e.pageX / getWidth();
  mouseY = e.pageY / getHeight();
}

function explode(className) {
  setTimeout(
    function() 
    {
      $(`.cube ${className}.front`).css("transform", "translateZ(300px)");
      $(`.cube ${className}.back`).css("transform", "translateZ(300px)");
      $(`.cube ${className}.top`).css("transform", "translateZ(300px)");
      $(`.cube ${className}.bottom`).css("transform", "translateZ(300px)");
      $(`.cube ${className}.left`).css("transform", "translateZ(300px)");
      $(`.cube ${className}.right`).css("transform", "translateZ(300px)");
      }, 100);
}

function assemble(className, translateZ) {
  setTimeout(
    function() 
    {
      $(`.cube ${className}.front`).css("transform", `rotateY(0deg) translateZ(${translateZ})`);
      $(`.cube ${className}.back`).css("transform", `rotateY(180deg) translateZ(${translateZ})`);
      $(`.cube ${className}.top`).css("transform", `rotateX(90deg) translateZ(${translateZ})`);
      $(`.cube ${className}.bottom`).css("transform", `rotateX(-90deg) translateZ(${translateZ})`);
      $(`.cube ${className}.left`).css("transform", `rotateY(90deg) translateZ(${translateZ})`);
      $(`.cube ${className}.right`).css("transform", `rotateY(-90deg) translateZ(${translateZ})`);
      }, 100);
}

$(document).click(function (event) {
  if (clicked == 0) {    
    explode('.face');
    explode('.bigface');
    explode('.smallface');
    clicked++;
    $('.stars-container').css('cursor','pointer');
  } else if (clicked == 1) {
    window.open("auth.html");
    clicked++;
    $('.stars-container').css('cursor','initial');
  } else if (clicked == 2) {
    assemble('.face', '148px');
    assemble('.bigface', '130px');
    assemble('.smallface', '80px');
    clicked = 0;
  } 
});

function rotateCube() {
  if (clicked == 0) {
    $(".cube").css("transition", "none");
    lastXDeg = lastXDeg + (getAngle(mouseX) - lastXDeg) * speed;
    lastYDeg = lastYDeg + (getAngle(mouseY) - lastYDeg) * speed;
    let newStyle = `translateZ(${defaultPerspective}) rotateY(${lastXDeg}deg) rotateX(${lastYDeg}deg)`;
    $(".cube").css("transform", newStyle);
  } else if (clicked == 1 || clicked == 2) {
    lastXDeg+= 20;
    $(".cube").css("transition", "2s");
    let newStyle = `translateZ(-150px) rotateY(90deg) rotateX(${lastXDeg}deg)`;
    $(".cube").css("transform", newStyle);
  }
}

// this function return the corresponding angle for an x value
function getAngle(x) {
  return 180 - 360 * x;
}

function getWidth() {
  return Math.max(
    document.body.scrollWidth,
    document.documentElement.scrollWidth,
    document.body.offsetWidth,
    document.documentElement.offsetWidth,
    document.documentElement.clientWidth
  );
}

function getHeight() {
  return Math.max(
    document.body.scrollHeight,
    document.documentElement.scrollHeight,
    document.body.offsetHeight,
    document.documentElement.offsetHeight,
    document.documentElement.clientHeight
  );
}
