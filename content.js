setInterval(
  function () {
    var date = new Date();
    semi = "AM";
    hour = date.getHours();
    minute = date.getMinutes();
    second = date.getSeconds();
    if (hour > 11) { semi = "PM"; }
    if (hour > 12) { hour = hour - 12; }
    if (hour == 0) { hour = 12; }
    if (minute < 10) { minute = "0" + minute; }
    if (second < 10) { second = "0" + second; }
    document.getElementById("clock").innerHTML = hour + ":" + minute + ":" + second + " " + semi;
  }, 1000);