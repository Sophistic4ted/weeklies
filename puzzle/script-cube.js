$(document).ready(function() {
  $('.center').delay(500).fadeIn(500);
  $('.smallface').delay(1000).fadeIn(500);
  $('.bigface').delay(2000).fadeIn(500);
  $('.front').delay(3000).fadeIn(100);
  $('.top').delay(3100).fadeIn(100);
  $('.left').delay(3200).fadeIn(100);
  $('.right').delay(3300).fadeIn(100);
  $('.bottom').delay(3400).fadeIn(100);
  $('.back').delay(3500).fadeIn(100);

});


// Global variable
const defaultPerspective = '-150px';
// const pageX = window.screen.width;
// const pageY = window.screen.height;
// Track the mouse movemont
let mouseX = 0;
let mouseY = 0;
let lastXDeg = 180;
let lastYDeg = 180;
// The speed of the cube following movement
const speed = 0.10;

$(document).ready(()=>{
  drawContent();
  setInterval(rotateCube, 66)
})

$(document).mousemove(updateMousePosition);

// Set inner heml for face
function drawContent() {
  $('.face').html(`
    <div class='face'></div> 
 `)
}

// Follow mouse movement
function updateMousePosition(e) {
  mouseX = e.pageX/getWidth();
  mouseY = e.pageY/getHeight();
}

function rotateCube() {
  lastXDeg = lastXDeg + (getAngle(mouseX) - lastXDeg
) * speed;
  lastYDeg = lastYDeg + (getAngle(mouseY) - lastYDeg
) * speed;
    let newStyle = `translateZ(${defaultPerspective}) rotateY(${lastXDeg}deg) rotateX(${lastYDeg}deg)`
    console.log(newStyle);
  $('.cube').css('transform', newStyle);
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
  )
}

function getHeight() {
  return Math.max(
    document.body.scrollHeight,
    document.documentElement.scrollHeight,
    document.body.offsetHeight,
    document.documentElement.offsetHeight,
    document.documentElement.clientHeight
  )
}