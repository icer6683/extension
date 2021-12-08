var time;
var rest;
var rounds;
var pause = false;
var cancel = false;

document.getElementById("form").addEventListener("submit", handleSubmit);
document.getElementById("form").addEventListener("submit", extractParameters);
document.getElementById("form").addEventListener("submit", function () { displayTimer() });
document.getElementById("form").addEventListener("submit", function () { timer() });

function handleSubmit(e) {
  "use strict";
  document.getElementById("form").style.display = "none";
  e.preventDefault();
}

function extractParameters(form) {
  time = form.target.elements[0].value;
  rest = form.target.elements[1].value;
  rounds = form.target.elements[2].value;
}

function displayTimer() {
  document.getElementById("pomodoro_timer").style.display = "block";
  document.getElementById("control_buttons").style.display = "block";
}

function timer() {
  var seconds = time * 60;
  setInterval(function () {
    document.getElementById("pomodoro_timer").innerHTML = "00:" + seconds;
    seconds--;
    if (seconds < 0) {
      clearInterval(timer);
    }
  }, 1000);
}

