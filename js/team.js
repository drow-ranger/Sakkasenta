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

  var urlParams = new URLSearchParams(window.location.search);
  var urlReferrer = document.referrer;
  var idTeam = Number(urlParams.get("id"));

  var favorite = document.getElementById("favorite");
  var unfavorite = document.getElementById("unfavorite");

  var item;
  if (urlReferrer.includes("/competition.html") || urlReferrer.includes("/team.html") || urlReferrer === "") {
    item = getTeam();
    loadTeamTab();
  } else {
    item = getTeam("favorite");
    document.getElementById("teamTabs").style.display = "none";
    document.getElementById("teamResume").style.marginBottom = "150px";
  }

  checkTeamFavorite(idTeam)
    .then((msg) => {
      favorite.style.display = "none";
      unfavorite.style.display = "block";
    })
    .catch((msg) => {
      favorite.style.display = "block";
      unfavorite.style.display = "none";
    });

  favorite.onclick = function () {
    item.then(function (team) {
      saveTeamFavorite(team);
    });
    favorite.style.display = "none";
    unfavorite.style.display = "block";
  };

  unfavorite.onclick = function () {
    deleteTeamFavorite(idTeam);
    unfavorite.style.display = "none";
    favorite.style.display = "block";
  };

  function loadTeamTab() {
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
      if (this.readyState == 4) {
        let content = document.querySelector("#teamTabs > #tab");
        if (this.status == 200) {
          content.innerHTML = xhttp.responseText;
          M.Tabs.init(document.querySelector("ul.tabs"));
          toggleTeamTab();
        } else if (this.status == 404) {
          content.innerHTML = "<p>Page can't be found.</p>";
        } else {
          content.innerHTML = "<p>Page can't be reached.</p>";
        }
      }
    };
    xhttp.open("GET", "pages/teamtab.html", true);
    xhttp.send();
  }

  function toggleTeamTab() {
    let standingLink = document.querySelectorAll(".tabs .tab a");
    standingLink[0].addEventListener("click", function () {
      getTeamSquads();
      document.getElementById("squadsTab").setAttribute("class", "active");
      document.getElementById("squadsTab").setAttribute("style", "display: block");
      document.getElementById("scheduledMatchesTab").setAttribute("style", "display: none");
      document.getElementById("finishedMatchesTab").setAttribute("style", "display: none");
    });
    standingLink[1].addEventListener("click", function () {
      getTeamMatches("SCHEDULED");
      document.getElementById("scheduledMatchesTab").setAttribute("class", "active");
      document.getElementById("scheduledMatchesTab").setAttribute("style", "display: block");
      document.getElementById("squadsTab").setAttribute("style", "display: none");
      document.getElementById("finishedMatchesTab").setAttribute("style", "display: none");
    });
    standingLink[2].addEventListener("click", function () {
      getTeamMatches("FINISHED");
      document.getElementById("finishedMatchesTab").setAttribute("class", "active");
      document.getElementById("finishedMatchesTab").setAttribute("style", "display: block");
      document.getElementById("squadsTab").setAttribute("style", "display: none");
      document.getElementById("scheduledMatchesTab").setAttribute("style", "display: none");
    });
  }
});
