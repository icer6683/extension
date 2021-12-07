document.getElementById("form").addEventListener("submit", handleSubmit);
function handleSubmit(e) {
  "use strict";
  document.getElementById("form").style.display = "none";
  e.preventDefault();
}