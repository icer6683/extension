setInterval(
  function () {
    var date = new Date();
    var semi = "AM";
    var hour = date.getHours();
    var minute = date.getMinutes();
    var second = date.getSeconds();
    if (hour > 11) { semi = "PM"; }
    if (hour > 12) { hour = hour - 12; }
    if (hour == 0) { hour = 12; }
    if (minute < 10) { minute = "0" + minute; }
    if (second < 10) { second = "0" + second; }
    document.getElementById("clock").innerHTML = hour + ":" + minute + " " + semi;
  }, 1000);