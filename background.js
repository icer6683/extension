let timerTime;
let timerID;
var timeRemaining;
let pause = false;

chrome.runtime.onConnect.addListener(function (port1) {
  port1.onMessage.addListener(function (msg1) {
    if (msg1.cmd === "give time") {
      var seconds = msg1.time;
      timerTime = new Date(new Date().getTime() + seconds * 1000);
      if (!timerID) {
        timerID = setTimeout(() => { alert("Done!") }, timerTime.getTime() - Date.now());
      }
      pause = false;
    } else if (msg1.cmd === "get the time") {
      if (pause === true) {
        timerTime = new Date(new Date().getTime() + timeRemaining * 1000);
      }
      port1.postMessage({ timeLeft: timerTime, checkPause: pause });
    } else if (msg1.cmd === "pause") {
      pause = true;
      if (timerID) {
        clearTimeout(timerID);
      }
      timeRemaining = msg1.timeNow;
    } else if (msg1.cmd === "start again") {
      pause = false;
    } else if (msg1.cmd === "cancel") {
      if (timerID) {
        clearTimeout(timerID);
      }
      pause = false;
      timerTime = null;
    }
  })
})
