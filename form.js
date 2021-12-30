var time;
var time_in_seconds = 0;
var minutes;
var seconds;
var rest;
var rounds;
let countdown;
var port1 = chrome.runtime.connect({
  name: "Start_Timer"
});

document.getElementById("form").addEventListener("submit", handleSubmit);
document.getElementById("form").addEventListener("submit", extractParameters);
document.getElementById("form").addEventListener("submit", function () { timer() });
document.addEventListener("DOMContentLoaded", function () { getTimeLeft(); });

function handleSubmit(e) {
  displayForm(0);
  displayTimer(1)
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
    document.getElementById("pause").style.display = "inline";
    document.getElementById("cancel").style.display = "inline";
    document.getElementById("start_again").style.display = "none";
  } else if (num === 0) {
    document.getElementById("pomodoro_timer").style.display = "none";
    document.getElementById("pause").style.display = "none";
    document.getElementById("cancel").style.display = "none";
    document.getElementById("start_again").style.display = "none";
  }
}

function timer() {
  port1.postMessage({ time: time_in_seconds, cmd: "give time" });
  getTimeLeft();
}

function runTimer(time, pause) {
  if (time.getTime() > Date.now()) {
    displayTimer(1);
    displayForm(0);
    if (!countdown && !pause) {
      countdown = setInterval(displayTime, 1000, time);
    } else if (pause) {
      stopTimer();
      displayTime(time);
    }
  }
}

function displayTime(time) {
  time_in_seconds = Math.round((time.getTime() - Date.now()) / 1000);
  minutes = Math.floor(time_in_seconds / 60);
  seconds = time_in_seconds % 60;
  document.getElementById("minutes").innerHTML = ddig(minutes);
  document.getElementById("seconds").innerHTML = ddig(seconds);
}

function getTimeLeft() {
  port1.postMessage({ cmd: "get the time" });
  port1.onMessage.addListener(function (msg) {
    if (msg.timeLeft) {
      const timeLeft = new Date(msg.timeLeft);
      runTimer(timeLeft, msg.checkPause);
    }
  })
}

function cancelTimer() {
  port1.postMessage({ cmd: "cancel" });
  clearInterval(countdown);
  countdown = null;
  document.getElementById("minutes").innerHTML = ddig(time);
  document.getElementById("seconds").innerHTML = ddig(00);
  document.getElementById("form").reset();
  displayForm(1);
  displayTimer(0);
}

function stopTimer() {
  port1.postMessage({ timeNow: time_in_seconds, cmd: "pause" });
  if (countdown) {
    clearInterval(countdown);
    countdown = null;
  }
  document.getElementById("pause").style.display = "none";
  document.getElementById("start_again").style.display = "inline";
}

function startTimerAgain() {
  port1.postMessage({ cmd: "start again" });
  timer();
  document.getElementById("pause").style.display = "inline";
  document.getElementById("start_again").style.display = "none";
}
