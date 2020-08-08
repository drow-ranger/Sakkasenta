const API_KEY = "e4727b547a0e40b1a28f12556aa4a451";
const BASE_URL = "https://api.football-data.org/v2";

const fetchAPI = (url) => {
  return fetch(url, {
    headers: {
      "X-Auth-Token": API_KEY,
    },
  });
};

const getCompetitions = () => {
  if ("caches" in window) {
    caches.match(`${BASE_URL}/competitions?plan=TIER_ONE`).then((res) => {
      if (res) {
        res.json().then((data) => {
          showCompetitions(data);
        });
      } else {
        fetchAPI(`${BASE_URL}/competitions?plan=TIER_ONE`)
          .then((res) => {
            if (res) {
              res.json().then((data) => {
                showCompetitions(data);
              });
            }
          })
          .catch((error) => {
            console.log(error);
            M.toast({
              html: `Wait for a second and try again to refresh. maskableIt seems like there are restrictions when calling data or you are offline.`,
            });
          });
      }
    });
  }
};

const showCompetitions = (data) => {
  let leaguesHTML = "";
  sortByKey(data.competitions, "name").forEach((league) => {
    leaguesHTML += `
      <div class="col s12 m3">
        <div class="card darken-2 z-depth-5">
          <div class="card-image waves-effect waves-block waves-light">
            <img class="activator center-align" alt="${league.code}" src="img/competitions/${league.code}.png">
          </div>
          <div class="card-content">
            <span class="card-title activator grey-text text-darken-4">
              ${league.name}
              <i class="material-icons right">more_vert</i>
            </span>
            <p><a href="./competition.html?id=${league.id}">More details...</a></p>
          </div>
          <div class="card-reveal darken-2 z-depth-5">
            <span class="card-title grey-text text-darken-4">
              ${league.name}
              <i class="material-icons right">close</i>
            </span>
            <br>
            <div class="row">
              <div class="col s2 m2 content"><i class="material-icons">place</i></div>
              <div class="col s10 m10 content info"><a
                  href="https://maps.google.com/?q=${league.area.name}">${league.area.name}</a></div>
            </div>
            <div class="row">
              <div class="col s2 m2 content"><i class="material-icons">date_range</i></div>
              <div class="col s10 m10 content info">${league.currentSeason.startDate} until ${league.currentSeason.endDate}
              </div>
            </div>
            <div class="row">
              <div class="col s2 m2 content"><i class="material-icons">play_arrow</i></div>
              <div class="col s10 m10 content info">${league.currentSeason.currentMatchday} Match</div>
            </div>
            <p><a href="./competition.html?id=${league.id}">More details...</a></p>
          </div>
        </div>
      </div>
    `;
  });
  removePreloader();
  document.getElementById("leagues").innerHTML = leaguesHTML;
};

const getCompetition = () => {
  const url = new URLSearchParams(window.location.search);
  const idCompetition = url.get("id");

  if ("caches" in window) {
    caches.match(`${BASE_URL}/competitions/${idCompetition}/`).then((res) => {
      if (res) {
        res.json().then((data) => {
          showCompetition(data);
        });
      } else {
        fetchAPI(`${BASE_URL}/competitions/${idCompetition}/`)
          .then((res) => {
            if (res) {
              res.json().then((data) => {
                showCompetition(data);
              });
            }
          })
          .catch((error) => {
            console.log(error);
            M.toast({
              html: `Wait for a second and try again to refresh. maskableIt seems like there are restrictions when calling data or you are offline.`,
            });
          });
      }
    });
  }
};

const showCompetition = (data) => {
  let competitionResumeHTML = ``;

  if (data.emblemUrl) {
    data.emblemUrl = data.emblemUrl.replace(/^http:\/\//i, "https://");
  }

  newLastUpdated = new Date(data.lastUpdated).toLocaleDateString("en-GB", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  competitionResumeHTML = `
    <div class="card-panel darken-2 z-depth-5">
      <div class="row">
          <div class="col s12 m6 center">
            <img class="responsive-img logo-img" alt="${data.emblemUrl}" src="img/competitions/${data.code}.png">
          </div>
          <div class="col s12 m6">
            <span class="truncate">
                <h4>${data.name}</h4>
            </span>
            <hr>
            <p>${data.code}</p>
            <hr>
            <p><i class="material-icons detail-competition-icons">place</i>
              <a href="https://maps.google.com/?q=${data.area.name}">${data.area.name}</a>
            </p>
            <p><i class="material-icons detail-competition-icons">date_range</i>
              ${data.currentSeason.startDate} until ${data.currentSeason.endDate}
            </p>
            <p><i class="material-icons detail-competition-icons">play_arrow</i>
              ${data.currentSeason.currentMatchday} Match
            </p>
            <p><i class="material-icons detail-competition-icons">update</i>
              Last update: ${newLastUpdated}
            </p>
          </div>
      </div>
    </div>
  `;
  getCompetitionStandings();
  removePreloader();
  document.getElementById("competitionResume").innerHTML = competitionResumeHTML;
};

const getCompetitionStandings = () => {
  const url = new URLSearchParams(window.location.search);
  const idCompetition = url.get("id");

  if ("caches" in window) {
    caches.match(`${BASE_URL}/competitions/${idCompetition}/standings?standingType=TOTAL`).then((res) => {
      if (res) {
        res.json().then((data) => {
          showCompetitionStandings(data);
        });
      }
    });
  }

  fetchAPI(`${BASE_URL}/competitions/${idCompetition}/standings?standingType=TOTAL`)
    .then((res) => {
      if (res) {
        res.json().then((data) => {
          showCompetitionStandings(data);
        });
      }
    })
    .catch((error) => {
      console.log(error);
      M.toast({
        html: `Wait for a second and try again to refresh. maskableIt seems like there are restrictions when calling data or you are offline.`,
      });
    });
};

const showCompetitionStandings = (data) => {
  let teamsHTML = ``;
  let standingsHTML = ``;
  data.standings.forEach((standing) => {
    if (standing.group) {
      standing.group = standing.group.replace("_", " ");
      teamsHTML += `
        <tr>
          <td><b>${standing.group}</b></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
      `;
    }

    standing.table.forEach((dataTeam) => {
      if (dataTeam.team.crestUrl === null || dataTeam.team.crestUrl === "") {
        dataTeam.team.crestUrl = "img/404-logo.jpg";
      } else {
        dataTeam.team.crestUrl = dataTeam.team.crestUrl.replace(/^http:\/\//i, "https://");
      }

      teamsHTML += `
        <tr>
          <td>${dataTeam.position}</td>
          <td>
            <a href="./team.html?id=${dataTeam.team.id}">
              <img src="${dataTeam.team.crestUrl}" onError="this.onerror=null;this.src='/img/404-logo.jpg';" alt="${dataTeam.team.name}" class="responsive-img" style="height:30px">
            </a>
          </td>
          <td>
            <a href="./team.html?id=${dataTeam.team.id}">
              ${dataTeam.team.name}
            </a>
          </td>
          <td>${dataTeam.playedGames}</td>
          <td>${dataTeam.won}</td>
          <td>${dataTeam.draw}</td>
          <td>${dataTeam.lost}</td>
          <td>${dataTeam.points}</td>
        </tr>
      `;
    });
  });

  standingsHTML = `
    <div class="col s12 m12">
      <div>
          <table class="white darken-4 highlight responsive-table centered">
              <thead>
                  <tr class="darken-2 z-depth-5">
                      <th>#</th>
                      <th>Logo</th>
                      <th>Club</th>
                      <th>Played</th>
                      <th>Won</th>
                      <th>Draw</th>
                      <th>Lost</th>
                      <th>Point</th>
                  </tr>
              </thead>
              <tbody>${teamsHTML}</tbody>
          </table>
      </div>
    </div>
  `;

  document.getElementById("standingsTab").innerHTML = standingsHTML;
};

const getCompetitionScorers = () => {
  const url = new URLSearchParams(window.location.search);
  const idCompetition = url.get("id");

  if ("caches" in window) {
    caches.match(`${BASE_URL}/competitions/${idCompetition}/scorers`).then((res) => {
      if (res) {
        res.json().then((data) => {
          showCompetitionScorers(data);
        });
      }
    });
  }

  fetchAPI(`${BASE_URL}/competitions/${idCompetition}/scorers`)
    .then((res) => {
      if (res) {
        res.json().then((data) => {
          showCompetitionScorers(data);
        });
      }
    })
    .catch((error) => {
      console.log(error);
      M.toast({
        html: `Wait for a second and try again to refresh. maskableIt seems like there are restrictions when calling data or you are offline.`,
      });
    });
};

const showCompetitionScorers = (data) => {
  let playersHTML = ``;
  let scorersHTML = ``;
  if (data.scorers.length !== 0) {
    data.scorers.forEach((scorer, index) => {
      playersHTML += `
        <tr>
          <td>${index + 1}</td>
          <td>${scorer.player.name}</td>
          <td>${scorer.team.name}</td>
          <td>${scorer.numberOfGoals}</td>
        </tr>
      `;
    });

    scorersHTML = `
      <div class="col s12 m12">
        <div>
            <table class="white darken-4 highlight responsive-table centered">
                <thead>
                    <tr class="darken-2 z-depth-5">
                        <th>#</th>
                        <th>Name</th>
                        <th>Team</th>
                        <th>Goals</th>
                    </tr>
                </thead>
                <tbody>${playersHTML}</tbody>
            </table>
        </div>
      </div>
    `;
  } else {
    scorersHTML = `
      <div class="col s12 m12">
        <div class="white">
            <span> No data in scorers ... </span>
        </div>
      </div>
    `;
  }
  document.getElementById("scorersTab").innerHTML = scorersHTML;
};

const getCompetitionMatches = () => {
  const url = new URLSearchParams(window.location.search);
  const idCompetition = url.get("id");

  if ("caches" in window) {
    caches.match(`${BASE_URL}/competitions/${idCompetition}/matches?status=SCHEDULED`).then((res) => {
      if (res) {
        res.json().then((data) => {
          showCompetitionMatches(data);
        });
      }
    });
  }

  fetchAPI(`${BASE_URL}/competitions/${idCompetition}/matches?status=SCHEDULED`)
    .then((res) => {
      if (res) {
        res.json().then((data) => {
          showCompetitionMatches(data);
        });
      }
    })
    .catch((error) => {
      console.log(error);
      M.toast({
        html: `Wait for a second and try again to refresh. maskableIt seems like there are restrictions when calling data or you are offline.`,
      });
    });
};

const showCompetitionMatches = (data) => {
  let teamsHTML = ``;
  let matchesHTML = ``;
  if (data.matches.length !== 0) {
    data.matches.forEach((match) => {
      newUtcDate = new Date(match.utcDate).toLocaleDateString("en-GB", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        timeZoneName: "short",
      });

      let score = "vs";
      if (match.status === "FINISHED") {
        score = `${match.score.fullTime.homeTeam} - ${match.score.fullTime.awayTeam}`;
      }

      teamsHTML += `
        <li class="collection-item avatar">
          <div class="row white darken-4 collapsible-header center-align" style="margin:0px;">
            <div class="col s12 m5">
              <a href="./team.html?id=${match.homeTeam.id}">
                  ${match.homeTeam.name}
              </a>
            </div>
            <div class="col s12 m2">
                ${score}
            </div>
            <div class="col s12 m5">
              <a href="./team.html?id=${match.awayTeam.id}">
                  ${match.awayTeam.name}
              </a>
            </div>
          </div>
          <div class="grey darken-4 white-text collapsible-body  center-align">
              <h6><b>${data.competition.name}</b></h6>
              <p>Match Day ${match.matchday}</p>
              <p>${newUtcDate}</p>
          </div>
        </li>
        `;
    });

    matchesHTML = `
      <div class="col s12 m12">
          <div>
              <ul class="collapsible">
                ${teamsHTML}
              </ul>
          </div>
      </div>
    `;
  } else {
    matchesHTML = `
      <div class="col s12 m12">
        <div class="white">
            <span> No data in matches ... </span>
        </div>
      </div>
    `;
  }
  document.getElementById(`matchesTab`).innerHTML = matchesHTML;
  M.Collapsible.init(document.querySelectorAll(".collapsible"));
};

const getTeam = (status) => {
  const url = new URLSearchParams(window.location.search);
  const idTeam = url.get("id");

  if (status === "favorite") {
    return new Promise(function (resolve, reject) {
      getTeamFavorite(parseInt(idTeam, 10)).then((data) => {
        showTeam(data, resolve);
      });
    });
  } else {
    return new Promise(function (resolve, reject) {
      if ("caches" in window) {
        caches.match(`${BASE_URL}/teams/${idTeam}`).then((res) => {
          if (res) {
            res.json().then((data) => {
              showTeam(data, resolve);
            });
          } else {
            fetchAPI(`${BASE_URL}/teams/${idTeam}`)
              .then((res) => {
                if (res) {
                  res.json().then((data) => {
                    showTeam(data, resolve);
                  });
                }
              })
              .catch((error) => {
                console.log(error);
                M.toast({
                  html: `Wait for a second and try again to refresh. maskableIt seems like there are restrictions when calling data or you are offline.`,
                });
              });
          }
        });
      }
    });
  }
};

const showTeam = (data, resolve) => {
  let teamResumeHTML = ``;
  if (data.crestUrl) {
    data.crestUrl = data.crestUrl.replace(/^http:\/\//i, "https://");
  } else {
    data.crestUrl = "/img/404-logo.png";
  }

  newLastUpdated = new Date(data.lastUpdated).toLocaleDateString("en-GB", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  teamResumeHTML = `
    <div class="card-panel darken-2 z-depth-5">
      <div class="row">
          <div class="col s12 m6 center">
              <img class="responsive-img logo-img" alt="${data.id}" src="${data.crestUrl}">
          </div>
          <div class="col s12 m6">
              <span class="truncate">
                  <h4>${data.name}</h4>
              </span>
              <hr>
              <p>${data.shortName} / ${data.tla}</p>
              <hr>
              <p><i class="material-icons detail-team-icons">home</i>
                <a href="https://maps.google.com/?q=${data.venue}">${data.venue}</a>
              </p>
              <p><i class="material-icons detail-team-icons">place</i>
                <a href="https://maps.google.com/?q=${data.address}">${data.address}</a>
              </p>
              <p><i class="material-icons detail-team-icons">email</i>
                <a href="mailto: ${data.email}">${data.email}</a>
              </p>
              <p><i class="material-icons detail-team-icons">phone</i>
                <a href="tel: ${data.phone}">${data.phone}</a>
              </p>
              <p><i class="material-icons detail-team-icons">cloud</i>
                <a href="${data.website}">${data.website}</a>
              </p>
          </div>
      </div>
    </div>
  `;
  resolve(data);
  getTeamSquads();
  removePreloader();
  document.getElementById("teamResume").innerHTML = teamResumeHTML;
};

const getTeamSquads = () => {
  const url = new URLSearchParams(window.location.search);
  const idTeam = url.get("id");

  if ("caches" in window) {
    caches.match(`${BASE_URL}/teams/${idTeam}`).then((res) => {
      if (res) {
        res.json().then((data) => {
          showTeamSquads(data);
        });
      }
    });
  }

  fetchAPI(`${BASE_URL}/teams/${idTeam}/`)
    .then((res) => {
      if (res) {
        res.json().then((data) => {
          showTeamSquads(data);
        });
      }
    })
    .catch((error) => {
      console.log(error);
      M.toast({
        html: `Wait for a second and try again to refresh. maskableIt seems like there are restrictions when calling data or you are offline.`,
      });
    });
};

const showTeamSquads = (data) => {
  let personsHTML = ``;
  let squadsHTML = ``;
  if (data.squad.length !== 0) {
    data.squad.forEach((dataSquad) => {
      newDateOfBirth = new Date(dataSquad.dateOfBirth).toLocaleDateString("en-GB", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      personsHTML += `
          <li class="collection-item avatar">
              <div class="white darken-4 collapsible-header">
                <i class="material-icons">child_care</i>${dataSquad.name}
              </div>
              <div class="grey darken-4 white-text collapsible-body">
                <h5>${dataSquad.name}</h5>
                <div class="col">
                  <div>
                    <i class="material-icons detail-squad-icons">date_range</i>${dataSquad.countryOfBirth}, ${newDateOfBirth}
                  </div>
                  <div>
                    <i class="material-icons detail-squad-icons">place</i><a href="https://maps.google.com/?q=${dataSquad.nationality}">${dataSquad.nationality}</a>
                  </div>
                  <div>
                    <i class="material-icons detail-squad-icons">directions_run</i>${dataSquad.position}
                  </div>
                  <div>
                    <i class="material-icons detail-squad-icons">loyalty</i>${dataSquad.role}</a>
                  </div>
                </div>
              </div>
          </li>
      `;
    });
    squadsHTML = `
      <div class="col s12 m12">
          <div>
              <ul class="collapsible">
                ${personsHTML}
              </ul>
          </div>
      </div>
    `;
  } else {
    squadsHTML = `
      <div class="col s12 m12">
        <div class="white">
            <span> No data in squads ... </span>
        </div>
      </div>
    `;
  }

  document.getElementById(`squadsTab`).innerHTML = squadsHTML;
  M.Collapsible.init(document.querySelectorAll(".collapsible"));
};

const getTeamMatches = (status) => {
  const url = new URLSearchParams(window.location.search);
  const idTeam = url.get("id");

  if ("caches" in window) {
    caches.match(`${BASE_URL}/teams/${idTeam}/matches?status=${status}`).then((res) => {
      if (res) {
        res.json().then((data) => {
          showTeamMatches(status, data);
        });
      }
    });
  }

  fetchAPI(`${BASE_URL}/teams/${idTeam}/matches?status=${status}`)
    .then((res) => {
      if (res) {
        res.json().then((data) => {
          showTeamMatches(status, data);
        });
      }
    })
    .catch((error) => {
      console.log(error);
      M.toast({
        html: `Wait for a second and try again to refresh. maskableIt seems like there are restrictions when calling data or you are offline.`,
      });
    });
};

const showTeamMatches = (status, data) => {
  let teamsHTML = ``;
  let matchesHTML = ``;
  if (data.matches.length !== 0) {
    data.matches.forEach((match) => {
      newUtcDate = new Date(match.utcDate).toLocaleDateString("en-GB", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        timeZoneName: "short",
      });

      let score = "vs";
      if (match.status === "FINISHED") {
        score = `${match.score.fullTime.homeTeam} - ${match.score.fullTime.awayTeam}`;
      }

      teamsHTML += `
        <li class="collection-item avatar">
          <div class="row white darken-4 collapsible-header center-align" style="margin:0px;">
            <div class="col s12 m5">
              <a href="./team.html?id=${match.homeTeam.id}">
                  ${match.homeTeam.name}
              </a>
            </div>
            <div class="col s12 m2">
                ${score}
            </div>
            <div class="col s12 m5">
              <a href="./team.html?id=${match.awayTeam.id}">
                  ${match.awayTeam.name}
              </a>
            </div>
          </div>
          <div class="grey darken-4 white-text collapsible-body  center-align">
              <h6><b>${match.competition.name}</b></h6>
              <p>Match Day ${match.matchday}</p>
              <p>${newUtcDate}</p>
          </div>
        </li>
        `;
    });

    matchesHTML = `
      <div class="col s12 m12">
          <div>
              <ul class="collapsible">
                ${teamsHTML}
              </ul>
          </div>
      </div>
    `;
  } else {
    matchesHTML = `
      <div class="col s12 m12">
        <div class="white">
            <span> No data in matches ... </span>
        </div>
      </div>
    `;
  }
  document.getElementById(`${status.toLowerCase()}MatchesTab`).innerHTML = matchesHTML;
  M.Collapsible.init(document.querySelectorAll(".collapsible"));
};

const getTeamsFavorites = () => {
  getTeamsFavoritesDb().then((teams) => {
    let teamsHTML = "";
    if (teams.length !== 0) {
      teams.forEach(function (team) {
        if (team.crestUrl) {
          team.crestUrl = team.crestUrl.replace(/^http:\/\//i, "https://");
        } else {
          team.crestUrl = "/img/404-logo.png";
        }

        teamsHTML += `
          <div class="col s12 m3">
            <div class="card darken-2 z-depth-5">
              <div class="card-image waves-effect waves-block waves-light">
                <img class="activator center-align" alt="${team.id}" src="${team.crestUrl}">
              </div>
              <div class="card-content">
                <span class="card-title activator grey-text text-darken-4">
                  ${team.shortName}
                  <i class="material-icons right">more_vert</i>
                </span>
                <p><a href="./team.html?id=${team.id}">More details...</a></p>
              </div>
              <div class="card-reveal darken-2 z-depth-5">
                <span class="card-title grey-text text-darken-4">
                  ${team.name}
                  <i class="material-icons right">close</i>
                </span>
                <br>
                <div class="row">
                  <div class="col s2 m2 content"><i class="material-icons">home</i></div>
                  <div class="col s10 m10 content info"><a
                      href="https://maps.google.com/?q=${team.venue}">${team.venue}</a></div>
                </div>
                <div class="row">
                  <div class="col s2 m2 content"><i class="material-icons">place</i></div>
                  <div class="col s10 m10 content info"><a
                      href="https://maps.google.com/?q=${team.address}">${team.address}</a></div>
                </div>
                <div class="row">
                  <div class="col s2 m2 content"><i class="material-icons">email</i></div>
                  <div class="col s10 m10 content info"><a href="mailto:${team.email}">${team.email}</a></div>
                </div>
                <div class="row">
                  <div class="col s2 m2 content"><i class="material-icons">phone</i></div>
                  <div class="col s10 m10 content info"><a href="tel:${team.phone}">${team.phone}</a></div>
                </div>
                <div class="row">
                  <div class="col s2 m2 content"><i class="material-icons">cloud</i></div>
                  <div class="col s10 m10 content info"><a href="${team.website}">${team.website}</a></div>
                </div>
                <p><a href="./team.html?id=${team.id}">More details...</a></p>
              </div>
            </div>
          </div>
        `;
      });
    } else {
      teamsHTML = `
        <div class="col s12 m12">
          <div>
              <span> No data in favorites ... </span>
          </div>
        </div>
      `;
    }
    removePreloader();
    document.getElementById("teams").innerHTML = teamsHTML;
  });
};

const getTeamsFavoritesDb = () => {
  return new Promise(function (resolve, reject) {
    dbPromised
      .then((db) => {
        let tx = db.transaction("teams", "readonly");
        let store = tx.objectStore("teams");
        return store.getAll();
      })
      .then(function (teams) {
        resolve(teams);
      });
  });
};

const sortByKey = (array, key) => {
  return array.sort((a, b) => {
    const x = a[key];
    const y = b[key];
    return x < y ? -1 : x > y ? 1 : 0;
  });
};

const removePreloader = () => {
  document.querySelector(".preloader-wrapper").style.display = "none";
  document.querySelector(".page-footer").style.display = "block";
};
