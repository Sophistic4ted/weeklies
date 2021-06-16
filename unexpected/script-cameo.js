var stringRandom = (function () {
  var counter = 0;

  var data = {
    isScrolling: false,
    repeat: 0,
    target1: [],
    target2: [],
    letters: "*+-/@_$[%£!XO1",
    singleLetters1: [],
    singleLetters2: [],
  };

  Array.prototype.shuffle = function () {
    var input = this;

    for (var i = input.length - 1; i >= 0; i--) {
      var randomIndex = Math.floor(Math.random() * (i + 1));
      var itemAtIndex = input[randomIndex];

      input[randomIndex] = input[i];
      input[i] = itemAtIndex;
    }
    return input;
  };

  function checkLength(x) {
    return Array.from(document.querySelectorAll(x)).length > 0;
  }

  function addListener(evt, fx) {
    window.addEventListener(evt, fx);
  }

  function changeLetter(letter) {
    if (letter.textContent != " ") {
      letter.classList.add("is-changing");
      letter.style.animationDuration = Math.random().toFixed(2) + "s";

      var newChar = data.letters.substr(Math.random() * data.letters.length, 1);

      letter.textContent = newChar;
      letter.setAttribute("data-txt", newChar);
    }
  }

  function resetLetter(letter, value) {
    letter.classList.remove("is-changing");
    letter.textContent = value;
    letter.setAttribute("data-txt", value);
  }

  // divide le singole lettere delle stringhe e le wrappa in span
  function divideLetters() {
    data.target1.forEach((element, index) => {
      var text = element.textContent;
      var textDivided = "";

      for (var i = 0; i < text.length; i++) {
        textDivided += `<span class="el-sp-first el-st-${index}-span-${i}" data-txt="${text.substr(
          i,
          1
        )}">${text.substr(i, 1)}</span>`;
      }

      element.innerHTML = textDivided;
    });

    data.target2.forEach((element, index) => {
      var text = element.textContent;
      var textDivided = "";

      for (var i = 0; i < text.length; i++) {
        textDivided += `<span class="el-sp-second el-st-${index}-span-${i}" data-txt="${text.substr(
          i,
          1
        )}">${text.substr(i, 1)}</span>`;
      }

      element.innerHTML = textDivided;
    });

    data.singleLetters1 = document.querySelectorAll(".el-sp-first");
    data.singleLetters2 = document.querySelectorAll(".el-sp-second");
  }

  // changes letters
  function changeLetters() {
    if (data.isScrolling) {
      data.singleLetters1.forEach(function (el, index) {
        changeLetter(el);
      });
      data.singleLetters2.forEach(function (el, index) {
        changeLetter(el);
      });
    }

    setTimeout(changeLetters, 10);
  }

  // reset to initial letters
  function resetLetters(changeTo1, changeTo2) {
    var randomArray1 = [];
    var randomArray2 = [];
    for (var i = 0; i < data.singleLetters1.length; i++) {
      randomArray1.push(i);
    }

    for (var i = 0; i < data.singleLetters2.length; i++) {
      randomArray2.push(i);
    }

    randomArray1.shuffle();
    randomArray2.shuffle();

    randomArray1.forEach(function (el, index) {
      setTimeout(function () {
        resetLetter(data.singleLetters1[el], changeTo1.substring(el, el + 1));
      }, index * 20 * (Math.random() * 5)).toFixed(2);
    });

    randomArray2.forEach(function (el, index) {
      setTimeout(function () {
        resetLetter(data.singleLetters2[el], changeTo2.substring(el, el + 1));
      }, index * 20 * (Math.random() * 5)).toFixed(2);
    });
  }

  // event listener sullo scroll
  function updateScrollState() {
    console.log(counter);
    switch (counter) {
      case 15:
        changeToLetters("?", "paean");
        break;
      case 30:
        changeToLetters("?", "mucho");
        break;
      case 45:
        changeToLetters("?", "oxlip");
        break;
      case 60:
        changeToLetters("?", "scald");
        break;
      case 75:
        changeToLetters("?", "");
        break;
      case 90:
        changeToLetters("tabor", "summa");
        counter = 0;
        break;
    }
    counter++;
  }

  function changeToLetters(changeTo1, changeTo2) {
    clearTimeout(delay);
    data.isScrolling = true;

    var delay = setTimeout(function () {
      data.isScrolling = false;
      resetLetters(changeTo1, changeTo2);
    }, 300);
  }

  return {
    init: function (selector1, selector2) {
      if (checkLength(selector1, selector2)) {
        data.target1 = Array.from(document.querySelectorAll(selector1));
        data.target2 = Array.from(document.querySelectorAll(selector2));

        divideLetters();

        changeLetters();

        addListener("scroll", updateScrollState);
      }
    },
  };
})();

stringRandom.init(".first", ".second");
