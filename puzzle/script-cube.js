// Global variable
let defaultPerspective = "-150px";
// const pageX = window.screen.width;
// const pageY = window.screen.height;
// Track the mouse movemont
let clicked = false;
let mouseX = 0;
let mouseY = 0;
let lastXDeg = 180;
let lastYDeg = 180;
// The speed of the cube following movement
const speed = 0.1;

async function sha256(message) {
  // encode as UTF-8
  const msgBuffer = new TextEncoder().encode(message);

  // hash the message
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);

  // convert ArrayBuffer to Array
  const hashArray = Array.from(new Uint8Array(hashBuffer));

  // convert bytes to hex string
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return hashHex;
}

async function getHashedLogin() {
  var login = document.getElementById("login").value;
  return sha256(login);
}

async function getHashedPass() {
  var pass = document.getElementById("pass").value;
  return sha256(pass);
}

async function submitAuthForm() {
  var login = await getHashedLogin();
  var pass = await getHashedPass();
  var check_url = `${login}/${pass}.html`;

  $.get(check_url)
    .done(function () {
      explode(".face", "300px");
      explode(".bigface", "260px");
      explode(".smallface", "200px");

      clicked = true;
      $(".stars-container").css("cursor", "pointer");

      $(".stars-container").click(function (event) {
        if (clicked) {
          assemble(".face", "148px");
          assemble(".bigface", "130px");
          assemble(".smallface", "80px");
          $(".stars-container").css("cursor", "initial");
          clicked = false;
          setTimeout(function () {
            window.location = check_url;
          }, 4500);
        }
      });
    })
    .fail(function () {
      $("#feedback").fadeIn(function() {
        $(this).text("That's not the answer!").delay(500).fadeOut();
      });
      
    });
}

$("#cb1").click(function() {
  submitAuthForm();
});

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

function explode(className, translateZ) {
  setTimeout(function () {
    $(`.cube ${className}.front`).css(
      "transform",
      `rotateY(0deg) translateZ(${translateZ})`
    );
    $(`.cube ${className}.back`).css(
      "transform",
      `rotateY(180deg) translateZ(${translateZ})`
    );
    $(`.cube ${className}.top`).css(
      "transform",
      `rotateX(90deg) translateZ(${translateZ})`
    );
    $(`.cube ${className}.bottom`).css(
      "transform",
      `rotateX(-90deg) translateZ(${translateZ})`
    );
    $(`.cube ${className}.left`).css(
      "transform",
      `rotateY(90deg) translateZ(${translateZ})`
    );
    $(`.cube ${className}.right`).css(
      "transform",
      `rotateY(-90deg) translateZ(${translateZ})`
    );
  }, 100);
}

function assemble(className, translateZ) {
  setTimeout(function () {
    $(`.cube ${className}.front`).css(
      "transform",
      `rotateY(0deg) translateZ(${translateZ})`
    );
    $(`.cube ${className}.back`).css(
      "transform",
      `rotateY(180deg) translateZ(${translateZ})`
    );
    $(`.cube ${className}.top`).css(
      "transform",
      `rotateX(90deg) translateZ(${translateZ})`
    );
    $(`.cube ${className}.bottom`).css(
      "transform",
      `rotateX(-90deg) translateZ(${translateZ})`
    );
    $(`.cube ${className}.left`).css(
      "transform",
      `rotateY(90deg) translateZ(${translateZ})`
    );
    $(`.cube ${className}.right`).css(
      "transform",
      `rotateY(-90deg) translateZ(${translateZ})`
    );
  }, 100);
}

function rotateCube() {
  if (!clicked) {
    $(".cube").css("transition", "none");
    lastXDeg = lastXDeg + (getAngle(mouseX) - lastXDeg) * speed;
    lastYDeg = lastYDeg + (getAngle(mouseY) - lastYDeg) * speed;
    let newStyle = `translateZ(${defaultPerspective}) rotateY(${lastXDeg}deg) rotateX(${lastYDeg}deg)`;
    $(".cube").css("transform", newStyle);
  } else if (clicked) {
    lastXDeg += 20;
    $(".center").css("background", "#00ffc3");
    $(".cube").css("transition", "2s");
    let newStyle = `translateZ(-60px) rotateY(135deg) rotateX(${lastXDeg}deg)`;
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
