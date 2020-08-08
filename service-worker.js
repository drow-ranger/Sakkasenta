importScripts("https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js");

const BASE_URL = "https://api.football-data.org/v2";
const CACHE_NAME = "caches";

if (workbox) {
  console.log(`Yay! Workbox is loaded 🎉`);
} else {
  console.log(`Boo! Workbox didn't load 😬`);
}

workbox.core.skipWaiting();
workbox.core.clientsClaim();

workbox.precaching.precacheAndRoute([
  { url: "/", revision: "1" },
  { url: "/favicon.ico", revision: "1" },
  { url: "/index.html", revision: "1" },
  { url: "/competition.html", revision: "1" },
  { url: "/team.html", revision: "1" },
  { url: "/offline.html", revision: "1" },
  { url: "/nav.html", revision: "1" },
  { url: "/manifest.json", revision: "1" },
  { url: "/css/materialize.min.css", revision: "1" },
  { url: "/css/style.css", revision: "1" },
  { url: "/img/404-logo.jpg", revision: "1" },
  { url: "/img/cancel.png", revision: "1" },
  { url: "/img/icon.png", revision: "1" },
  { url: "/img/icon.svg", revision: "1" },
  { url: "/img/icon-72.png", revision: "1" },
  { url: "/img/icon-96.png", revision: "1" },
  { url: "/img/icon-128.png", revision: "1" },
  { url: "/img/icon-144.png", revision: "1" },
  { url: "/img/icon-152.png", revision: "1" },
  { url: "/img/icon-192.png", revision: "1" },
  { url: "/img/icon-384.png", revision: "1" },
  { url: "/img/icon-512.png", revision: "1" },
  { url: "/img/offline.jpg", revision: "1" },
  { url: "/img/yes.png", revision: "1" },
  { url: "/img/competitions/BL1.png", revision: "1" },
  { url: "/img/competitions/BSA.png", revision: "1" },
  { url: "/img/competitions/CL.png", revision: "1" },
  { url: "/img/competitions/DED.png", revision: "1" },
  { url: "/img/competitions/EC.png", revision: "1" },
  { url: "/img/competitions/ELC.png", revision: "1" },
  { url: "/img/competitions/FL1.png", revision: "1" },
  { url: "/img/competitions/PD.png", revision: "1" },
  { url: "/img/competitions/PL.png", revision: "1" },
  { url: "/img/competitions/PPL.png", revision: "1" },
  { url: "/img/competitions/SA.png", revision: "1" },
  { url: "/img/competitions/WC.png", revision: "1" },
  { url: "/js/api.js", revision: "1" },
  { url: "/js/app.js", revision: "1" },
  { url: "/js/competition.js", revision: "1" },
  { url: "/js/db.js", revision: "1" },
  { url: "/js/idb.js", revision: "1" },
  { url: "/js/jquery.js", revision: "1" },
  { url: "/js/materialize.min.js", revision: "1" },
  { url: "/js/index.js", revision: "1" },
  { url: "/js/team.js", revision: "1" },
  { url: "/js/offline.js", revision: "1" },
  { url: "/pages/about.html", revision: "1" },
  { url: "/pages/competitiontab.html", revision: "1" },
  { url: "/pages/favorites.html", revision: "1" },
  { url: "/pages/home.html", revision: "1" },
  { url: "/pages/teamtab.html", revision: "1" },
]);

self.addEventListener("install", (event) => {
  const urls = ["/offline.html"];
  const cacheName = workbox.core.cacheNames.runtime;
  event.waitUntil(caches.open(cacheName).then((cache) => cache.addAll(urls)));
});

const offlinePage = "/offline.html";

workbox.routing.registerRoute(new RegExp("/"), async ({ event }) => {
  try {
    return await workbox.strategies
      .networkFirst({
        cacheName: "ruang-bola",
        plugins: [
          new workbox.expiration.Plugin({
            maxEntries: 60,
            maxAgeSeconds: 30 * 24 * 60 * 60,
          }),
        ],
      })
      .handle({
        event,
      });
  } catch (error) {
    return caches.match(offlinePage);
  }
});

workbox.routing.registerRoute(
  /^https:\/\/api\.football\-data\.org\/v2\//,
  workbox.strategies.staleWhileRevalidate({
    cacheName: "football-data-api",
    plugins: [
      new workbox.expiration.Plugin({
        maxEntries: 120,
        maxAgeSeconds: 30 * 24 * 60 * 60,
      }),
    ],
  })
);

workbox.routing.registerRoute(
  /\.(?:png|jpx|css|svg)$/,
  workbox.strategies.cacheFirst({
    cacheName: "images",
    plugins: [
      new workbox.expiration.Plugin({
        maxEntries: 25,
        maxAgeSeconds: 30 * 24 * 60 * 60,
      }),
    ],
  })
);

workbox.routing.registerRoute(
  /\.(?:woff2)$/,
  workbox.strategies.cacheFirst({
    cacheName: "font-icon",
    plugins: [
      new workbox.expiration.Plugin({
        maxEntries: 25,
        maxAgeSeconds: 30 * 24 * 60 * 60,
      }),
    ],
  })
);

self.addEventListener("push", function (event) {
  let body;
  if (event.data) {
    body = event.data.text();
  } else {
    body = "Push message no payload";
  }
  let options = {
    body: body,
    icon: "img/icon.svg",
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1,
    },
  };
  event.waitUntil(self.registration.showNotification("Sakkasenta", options));
});

self.addEventListener("notificationclick", function (event) {
  event.notification.close();
  if (!event.action) {
    return;
  }
  switch (event.action) {
    case "check-favorites-teams-action":
      clients.openWindow("/#favorites");
      break;
    default:
      break;
  }
});
