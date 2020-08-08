document.addEventListener("DOMContentLoaded", () => {
  loadNav();

  function loadNav() {
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
      if (this.readyState === 4) {
        if (this.status !== 200) return;

        document.querySelectorAll(".topnav, .botnav").forEach((elm) => (elm.innerHTML = xhttp.responseText));

        document.querySelectorAll(".botnav li a, .topnav li a").forEach((elm) =>
          elm.addEventListener("click", (event) => {
            if (event.target.attributes.href) {
              page = event.target.attributes.href.value.substr(1);
              loadPage(page);
            } else {
              page = event.target.parentNode.attributes.href.value.substr(1);
              loadPage(page);
            }
          })
        );
      }
    };
    xhttp.open("GET", "nav.html", true);
    xhttp.send();
  }

  let page = window.location.hash.substr(1);
  if (page === "") page = "home";
  loadPage(page);

  function loadPage(page) {
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
      if (this.readyState === 4) {
        let content = document.querySelector("#body-content");
        if (this.status === 200) {
          content.innerHTML = xhttp.responseText;
          loadApi(page);
        } else if (this.status === 404) {
          content.innerHTML = "<p>Page can't be found.</p>";
        } else {
          content.innerHTML = "<p>Page can't be reached.</p>";
        }
      }
    };
    xhttp.open("GET", "pages/" + page + ".html", true);
    xhttp.send();
  }

  function loadApi(page) {
    switch (page) {
      case "home":
        getCompetitions();
        break;
      case "favorites":
        getTeamsFavorites();
        break;
      case "about":
        removePreloader();
        break;
      default:
        break;
    }
  }
});
