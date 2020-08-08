var dbPromised = idb.open("sakkasenta", 1, (upgradeDb) =>
  upgradeDb.createObjectStore("teams", {
    keyPath: "id",
  })
);

const saveTeamFavorite = (team) =>
  dbPromised
    .then((db) => {
      let tx = db.transaction("teams", "readwrite");
      let store = tx.objectStore("teams");
      store.put(team);
      tx.complete;
    })
    .then(() => {
      const title = "Successfully Added Favorites Team!";
      const options = {
        body: `${team.name} has been added to the Favorites Team. Do you want to see a list of your Favorites Teams?`,
        badge: "/img/icon.png",
        icon: "/img/icon.png",
        actions: [
          {
            action: "check-favorites-teams-action",
            title: "Yes",
            icon: "/img/yes.png",
          },
          {
            action: "no-action",
            title: "No",
            icon: "/img/cancel.png",
          },
        ],
      };
      if (Notification.permission === "granted") {
        navigator.serviceWorker.ready.then((registration) => registration.showNotification(title, options));
      } else {
        M.toast({
          html: `${team.name} has been added to the Favorites Team.`,
        });
      }
    })
    .catch(() =>
      M.toast({
        html: `${team.name} faied to be added to the Favorites Team.`,
      })
    );

const deleteTeamFavorite = (team) => {
  getTeamFavorite(team).then((favorite) => {
    dbPromised
      .then((db) => {
        let tx = db.transaction("teams", "readwrite");
        let store = tx.objectStore("teams");
        ya = store.get(team);
        store.delete(team);
        tx.complete;
      })
      .then(() => {
        const title = "Successfully Deleted Favorites Team!";
        const options = {
          body: `${favorite.name} has been deleted from Favorites Team.`,
          badge: "/img/icon.png",
          icon: "/img/icon.png",
        };
        if (Notification.permission === "granted") {
          navigator.serviceWorker.ready.then((registration) => registration.showNotification(title, options));
        } else {
          M.toast({
            html: `${favorite.name} has been deleted from Favorites Team.`,
          });
        }
      })
      .catch(() =>
        M.toast({
          html: `${favorite.name} faied to be deleted from Favorites Team.`,
        })
      );
  });
};

const checkTeamFavorite = (id) => {
  return new Promise((resolve, reject) => {
    dbPromised
      .then((db) => {
        let tx = db.transaction("teams", "readonly");
        let store = tx.objectStore("teams");
        return store.get(id);
      })
      .then((favorite) => {
        if (favorite !== undefined) {
          resolve(true);
        } else {
          reject(false);
        }
      });
  });
};

function getTeamFavorite(id) {
  return dbPromised
    .then((db) => {
      let tx = db.transaction("teams", "readonly");
      let store = tx.objectStore("teams");
      return store.get(id);
    })
    .catch((error) => {
      console.log(error);
      return error;
    });
}
