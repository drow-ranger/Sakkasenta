if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("service-worker.js")
      .then(() => console.log("Registration ServiceWorker successfully."))
      .catch(() => console.log("Registration ServiceWorker failed."));

    requestPermission();
  });
} else {
  console.log("Browser not supported ServiceWorker worker.");
}

function requestPermission() {
  if ("Notification" in window) {
    Notification.requestPermission().then((result) => {
      if (result === "denied") {
        console.log("Notifications feature not allowed.");
        return;
      } else if (result === "default") {
        console.error("User closes request permission dialog.");
        return;
      }

      navigator.serviceWorker.ready.then(() => {
        if ("PushManager" in window) {
          navigator.serviceWorker.getRegistration().then((registration) =>
            registration.pushManager
              .subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array("BLIgKwuTRc-iCPzVGR1o90fUkZ2MpmCoRIwlXVSRcrSK1u1TGyQ1H74EllufYYiEj7xjt7GbvXmCT_aWiFyQg-s"),
              })
              .then((subscribe) => {
                const p256dh = btoa(String.fromCharCode.apply(null, new Uint8Array(subscribe.getKey("p256dh"))));
                const auth = btoa(String.fromCharCode.apply(null, new Uint8Array(subscribe.getKey("auth"))));

                console.log("Endpoint: ", subscribe.endpoint);
                console.log("p256dh key: ", p256dh);
                console.log("Auth key: ", auth);
              })
              .catch((e) => console.error("Failed to subscribe.", e.message))
          );
        }
      });
    });
  } else {
    console.log("Browser not supported notifications");
  }
}

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
