document.addEventListener("DOMContentLoaded", () => {
  loadNav();

  function loadNav() {
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
      if (this.readyState == 4) {
        if (this.status != 200) return;

        document.querySelectorAll(".topnav, .botnav").forEach((elm) => (elm.innerHTML = xhttp.responseText));

        document.querySelectorAll(".botnav li a, .topnav li a").forEach((elm) =>
          elm.addEventListener("click", (event) => {
            if (event.target.attributes.href) {
              event.target.attributes.href.value = `./index.html${event.target.attributes.href.value}`;
            } else {
              event.target.parentNode.attributes.href.value = `./index.html${event.target.parentNode.attributes.href.value}`;
            }
          })
        );
      }
    };
    xhttp.open("GET", "nav.html", true);
    xhttp.send();
  }
});
