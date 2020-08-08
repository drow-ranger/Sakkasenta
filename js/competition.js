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

  getCompetition();
  loadCompetitionTab();

  function loadCompetitionTab() {
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
      if (this.readyState === 4) {
        let content = document.querySelector("#competitionTabs > #tab");
        if (this.status === 200) {
          content.innerHTML = xhttp.responseText;
          M.Tabs.init(document.querySelector("ul.tabs"));
          toggleStandingTab();
        } else if (this.status === 404) {
          content.innerHTML = "<p>Page can't be found.</p>";
        } else {
          content.innerHTML = "<p>Page can't be reached.</p>";
        }
      }
    };
    xhttp.open("GET", "pages/competitiontab.html", true);
    xhttp.send();
  }

  function toggleStandingTab() {
    let standingLink = document.querySelectorAll(".tabs .tab a");
    standingLink[0].addEventListener("click", function () {
      getCompetitionStandings();
      document.getElementById("standingsTab").setAttribute("class", "active");
      document.getElementById("standingsTab").setAttribute("style", "display: block");
      document.getElementById("scorersTab").setAttribute("style", "display: none");
      document.getElementById("matchesTab").setAttribute("style", "display: none");
    });
    standingLink[1].addEventListener("click", function () {
      getCompetitionScorers();
      document.getElementById("scorersTab").setAttribute("class", "active");
      document.getElementById("scorersTab").setAttribute("style", "display: block");
      document.getElementById("standingsTab").setAttribute("style", "display: none");
      document.getElementById("matchesTab").setAttribute("style", "display: none");
    });
    standingLink[2].addEventListener("click", function () {
      getCompetitionMatches();
      document.getElementById("matchesTab").setAttribute("class", "active");
      document.getElementById("matchesTab").setAttribute("style", "display: block");
      document.getElementById("standingsTab").setAttribute("style", "display: none");
      document.getElementById("scorersTab").setAttribute("style", "display: none");
    });
  }
});
