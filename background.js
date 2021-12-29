let timerTime;
let timerID;
let timeRemaining;

chrome.runtime.onConnect.addListener(function (port1) {
  port1.onMessage.addListener(function (msg1) {
    if (msg1.cmd === "give time") {
      var seconds = parseInt(msg1.time);;
      timerTime = new Date(new Date().getTime() + seconds * 1000);
      if (!timeID) {
        timerID = setTimeout(() => { alert("Done!") }, timerTime.getTime() - Date.now());
      }
    }
    else if (msg1.cmd === "get the time") {
      port1.postMessage({ timeLeft: timerTime });
    } else if (msg1.cmd === "pause") {
      if (timeID) {
        clearTimeout(timerID);
      }
      timeRemaining = parseInt(msg1.timeNow);
    } else if (msg1.cmd === "start again") {
      timerTime = new Date(new Date().getTime() + timeRemaining * 1000);
      timerID = setTimeout(() => { alert("Done!") }, timerTime.getTime() - Date.now());
    } else if (msg1.cmd === "cancel") {
      if (timeID) {
        clearTimeout(timerID);
      }
      timerTime = null;
    }
  })
})
