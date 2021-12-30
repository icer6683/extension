let timerTime;
let timerID;
var timeRemaining;
let seconds;
let restTime;
let smallRoundsLeft;
let roundsLeft;
let study = true;
let pause = false;


chrome.runtime.onConnect.addListener(function (port1) {
  port1.onMessage.addListener(function (msg1) {
    if (msg1.start === "initiate") {
      seconds = msg1.time;
      restTime = msg1.restTime;
      smallRoundsLeft = (2 * msg1.rounds) - 1;
      roundsLeft = msg1.rounds;
    }
    if (msg1.cmd === "done or not") {
      roundChanger();
      if (smallRoundsLeft == 0) {
        port1.postMessage({ msg: "done" });
      } else {
        port1.postMessage({ msg: "not yet" });
      }
    } else if (msg1.cmd === "give time") {
      timerMaker(seconds);
    } else if (msg1.cmd === "get the time") {
      port1.postMessage({ timeLeft: timerTime, checkPause: pause, roundsLeft: roundsLeft });
    } else if (msg1.cmd === "pause") {
      pause = true;
      if (timerID) {
        clearTimeout(timerID);
      }
      timeRemaining = msg1.timeNow;
    } else if (msg1.cmd === "start again") {
      if (pause === true) {
        timerTime = new Date(new Date().getTime() + timeRemaining * 1000);
      }
      pause = false;
    } else if (msg1.cmd === "cancel") {
      if (timerID) {
        clearTimeout(timerID);
      }
      pause = false;
      timerTime = null;
      smallRoundsLeft = 0;
      roundsLeft = 0;
    }
  })
})

function roundChanger() {
  if (study == true) {
    study = false;
  } else if (study == false) {
    study = true;
    roundsLeft--;
  }
  if (timerID) {
    clearTimeout(timerID);
  }
  timerTime = null;
  smallRoundsLeft--;
  if (smallRoundsLeft > 0) {
    timerMaker(study ? seconds : restTime);
  }
}

function timerMaker(time) {
  timerTime = new Date(new Date().getTime() + time * 1000);
  if (!timerID) {
    timerID = setTimeout(console.log("done"), timerTime.getTime() - Date.now());
  }
  pause = false;
}