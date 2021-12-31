/** This variable stores the minute value of each round length. It is sort of 
 * unnecessary. 
*/
var time;

/** This variable initially stores the second value of the round length. It 
 * is updated every second as the countdown timer runs. 
*/
var time_in_seconds;

/** This variable is the number of minutes displayed on the timer. */
var minutes;

/** This variable is the number of seconds displayed on the timer. */
var seconds;

/** This variable stores the minute value of the rest length.  */
var rest;

/** This variables is the number of rounds. */
var rounds;

/** This variable will store the setInterval() object that updates the timer */
let countdown;

/** This vaariables holds a Date object of the time of when the timer should 
 * finish.
 */
let timeLeft;

/** This variable is the number of rounds left, which includes the current 
 * rounds. It is updated after every round has completed.
*/
let roundsLeft;

/** This variable is a boolean. It is true when in study round and false when
 * in rest round.
 */
let study;

/** This is a long-lived communication that handles all the messaging between 
 * the popup script and the background script. 
 */
var port1 = chrome.runtime.connect({
  name: "Start_Timer"
});

/** This code is triggered upon form submission. */
document.getElementById("form").addEventListener("submit", handleSubmit);
document.getElementById("form").addEventListener("submit", extractParameters);
document.getElementById("form").addEventListener("submit", function () { timer() });
document.addEventListener("DOMContentLoaded", function () { getTimeLeft(); });

/** This is responsible for preventing refresh after form submission and 
 * changing interface. */
function handleSubmit(e) {
  displayForm(0);
  displayTimer(1)
  e.preventDefault();
}

/** This turns a number to a double digit format. */
function ddig(num) { return num > 9 ? num : "0" + num; }

/** This is reponsible for extracting values from form and storing the values. */
function extractParameters(form) {
  time = form.target.elements[0].value;
  rest = form.target.elements[1].value;
  rounds = form.target.elements[2].value;
  time_in_seconds = time * 60;
}

/** This function can display or hide the form based on input. Input of 1 shows 
 * the form. Input of 0 hides the form*/
function displayForm(num) {
  if (num === 1) {
    document.getElementById("form").style.display = "block";
  } else if (num === 0) {
    document.getElementById("form").style.display = "none";
  }
}

/* Connects functions with pomodoro timer buttons */
document.getElementById("pause").addEventListener("click",
  function () { stopTimer() });
document.getElementById("cancel").addEventListener("click",
  function () { cancelTimer() });
document.getElementById("start_again").addEventListener("click",
  function () { startTimerAgain() });

/** This function can display or hide the timer interface based on input. Input 
 * of 1 shows the timer. Input of 0 hides the timer*/
function displayTimer(num) {
  if (num === 1) {
    document.getElementById("pomodoro_timer").style.display = "block";
    document.getElementById("pause").style.display = "inline";
    document.getElementById("cancel").style.display = "inline";
    document.getElementById("start_again").style.display = "none";
    document.getElementById("rounds_left_out").style.display = "block";
    document.getElementById("study_rest").style.display = "block";
  } else if (num === 0) {
    document.getElementById("pomodoro_timer").style.display = "none";
    document.getElementById("pause").style.display = "none";
    document.getElementById("cancel").style.display = "none";
    document.getElementById("start_again").style.display = "none";
    document.getElementById("rounds_left_out").style.display = "none";
    document.getElementById("study_rest").style.display = "none";
  }
}

/** Sends extracted values to the background script. Only called once when form 
 * is submitted. This then proceeds to call getTimeLeft().
*/
function timer() {
  port1.postMessage({
    time: time_in_seconds, cmd: "give time",
    restTime: rest * 60, rounds: rounds, start: "initiate"
  });
  getTimeLeft();
}

/** The parameter 'time' is a Date object for the time the timer ends. The parameter
 * 'pause' is a boolean for whether the timer is paused or not. This function 
 * decide whether or not to instantiate setInterval() and call displayTime(time).
*/
function runTimer(time, pause) {
  if (time.getTime() > Date.now()) {
    displayTimer(1);
    displayForm(0);
    if (study) {
      document.getElementById("study_rest").innerHTML = "STUDY";
    } else {
      document.getElementById("study_rest").innerHTML = "REST";
    }
    document.getElementById("rounds_left_in").innerHTML = ddig(roundsLeft);
    if (!countdown && !pause) {
      countdown = setInterval(displayTime, 1000, time);
    } else if (pause) {
      time_in_seconds = Math.round((time.getTime() - Date.now()) / 1000);
      stopTimer();
      displayTime(time);
    }
  }
}

/** The parameter 'time' is a Date object for the time the timer ends. This 
 * function will change and update the timer to reflect current time remaining. 
 * When timer is done, the function will decide whether or not to start another
 * round by posting a message to background script.
*/
function displayTime(time) {
  time_in_seconds = Math.round((time.getTime() - Date.now()) / 1000);
  if (time_in_seconds === 0) {
    clearInterval(countdown);
    countdown = null;
    port1.postMessage({ cmd: "done or not" });
    port1.onMessage.addListener(function checkDone(msg) {
      if (msg.msg === "done") {
        cancelTimer();
      } else {
        getTimeLeft();
      }
      port1.onMessage.removeListener(checkDone);
    })
  }
  minutes = Math.floor(time_in_seconds / 60);
  seconds = time_in_seconds % 60;
  document.getElementById("minutes").innerHTML = ddig(minutes);
  document.getElementById("seconds").innerHTML = ddig(seconds);
}

/** This function calls the background script to find out current time left in 
 * this round. This function is called everytime the popup is opened.  It then
 * calls runTimer(time, pause) based on response received. 
*/
function getTimeLeft() {
  port1.postMessage({ cmd: "get the time" });
  port1.onMessage.addListener(function checkTime(msg) {
    if (msg.timeLeft) {
      timeLeft = new Date(msg.timeLeft);
      roundsLeft = msg.roundsLeft;
      study = msg.study;
      runTimer(timeLeft, msg.checkPause);
    }
    port1.onMessage.removeListener(checkTime);
  })
}

/** This function is called upon click of 'cancel' button. It will clear the 
 * timer and change display back to initial form interface. 
 */
function cancelTimer() {
  port1.postMessage({ cmd: "cancel" });
  clearInterval(countdown);
  countdown = null;
  document.getElementById("minutes").innerHTML = ddig(00);
  document.getElementById("seconds").innerHTML = ddig(00);
  document.getElementById("form").reset();
  displayForm(1);
  displayTimer(0);
}

/** This function is called upon click of 'pause' button. It will stop the timer
 * and store the current time left in the background script. 
 */
function stopTimer() {
  port1.postMessage({ timeNow: time_in_seconds, cmd: "pause" });
  clearInterval(countdown);
  countdown = null;
  document.getElementById("pause").style.display = "none";
  document.getElementById("start_again").style.display = "inline";
}

/** This function is called upon click of 'continue' button. It will resume the 
 * timer countdown. 
 */
function startTimerAgain() {
  port1.postMessage({ cmd: "start again" });
  getTimeLeft();
  document.getElementById("pause").style.display = "inline";
  document.getElementById("start_again").style.display = "none";
}
