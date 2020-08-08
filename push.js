require("dotenv").config();
const webPush = require("web-push");

const vapidKeys = {
  publicKey: process.env.vapidKeyPublic,
  privateKey: process.env.vapidKeyPrivate,
};

webPush.setVapidDetails("mailto:nico98deo@gmail.com", vapidKeys.publicKey, vapidKeys.privateKey);

const pushSubscription = {
  endpoint: process.env.endpointPushSubscription,
  keys: {
    p256dh: process.env.vP256dhKeyPushSubscription,
    auth: process.env.authKeyPushSubscription,
  },
};

const options = {
  gcmAPIKey: process.env.gcmAPIKey,
  TTL: 60,
};

const payloads = "Congrats! Your Application Succesfull to Receive Push Notifications! ";

webPush.sendNotification(pushSubscription, payloads, options);
