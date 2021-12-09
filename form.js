var time;
var time_in_seconds;
var minutes;
var seconds;
var rest;
var rounds;
var pause = false;
var cancel = false;
var countdown;

document.getElementById("form").addEventListener("submit", handleSubmit);
document.getElementById("form").addEventListener("submit", extractParameters);
document.getElementById("form").addEventListener("submit", function () { displayTimer(1) });
document.getElementById("form").addEventListener("submit", function () { timer() });

function handleSubmit(e) {
  "use strict";
  displayForm(0);
  e.preventDefault();
}

function ddig(num) { return num > 9 ? num : "0" + num; }

function extractParameters(form) {
  time = form.target.elements[0].value;
  rest = form.target.elements[1].value;
  rounds = form.target.elements[2].value;
  time_in_seconds = time * 60;
  document.getElementById("minutes").innerHTML = ddig(time);
  document.getElementById("seconds").innerHTML = ddig(00);
}

function displayForm(num) {
  if (num === 1) {
    document.getElementById("form").style.display = "block";
  } else if (num === 0) {
    document.getElementById("form").style.display = "none";
  }
}

document.getElementById("pause").addEventListener("click", function () { stopTimer() });
document.getElementById("cancel").addEventListener("click", function () { cancelTimer() });
document.getElementById("start_again").addEventListener("click", function () { startTimerAgain() });

function displayTimer(num) {
  if (num === 1) {
    document.getElementById("pomodoro_timer").style.display = "block";
    document.getElementById("control_buttons").style.display = "block";
    document.getElementById("start_again").style.display = "none";
  } else if (num === 0) {
    document.getElementById("pomodoro_timer").style.display = "none";
    document.getElementById("control_buttons").style.display = "none";
  }
}

function timer() {
  countdown = setInterval(function () {
    time_in_seconds--;
    minutes = Math.floor(time_in_seconds / 60);
    seconds = time_in_seconds % 60;
    document.getElementById("minutes").innerHTML = ddig(minutes);
    document.getElementById("seconds").innerHTML = ddig(seconds);
    if (time_in_seconds < 0) {
      clearInterval(countdown);
    }
  }, 1000);
}

function cancelTimer() {
  clearInterval(countdown);
  document.getElementById("minutes").innerHTML = ddig(time);
  document.getElementById("seconds").innerHTML = ddig(00);
  timer_in_seconds = 0;
  document.getElementById("form").reset();
  displayForm(1);
  displayTimer(0);
}

function stopTimer() {
  clearInterval(countdown);
  document.getElementById("pause").style.display = "none";
  document.getElementById("start_again").style.display = "inline";
}

function startTimerAgain() {
  timer();
  document.getElementById("pause").style.display = "inline";
  document.getElementById("start_again").style.display = "none";
}

