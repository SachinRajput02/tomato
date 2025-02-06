// Import Firebase libraries for service worker

importScripts("https://www.gstatic.com/firebasejs/9.15.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.15.0/firebase-messaging-compat.js");

const firebaseConfig = {
  apiKey: "AIzaSyBT9xm-txBmjE3oW1Q-ZWIPfDRpK8UWmPI",
  authDomain: "food-del-66e22.firebaseapp.com",
  projectId: "food-del-66e22",
  storageBucket: "food-del-66e22.firebasestorage.app",
  messagingSenderId: "70727244191",
  appId: "1:70727244191:web:bcdd9356067f7df224c5aa",
  measurementId: "G-W3RG0GGSY2",
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload
  );

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: "/firebase-logo.png", // Replace with your logo
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

