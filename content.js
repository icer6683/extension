setInterval(
  function () {
    var date = new Date();
    document.getElementById("clock").innerHTML = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
  }, 1000)

