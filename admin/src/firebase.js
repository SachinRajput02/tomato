import { initializeApp } from "firebase/app";
import { getMessaging, getToken , onMessage} from "firebase/messaging";


const firebaseConfig = {
  apiKey: "AIzaSyBT9xm-txBmjE3oW1Q-ZWIPfDRpK8UWmPI",
  authDomain: "food-del-66e22.firebaseapp.com",
  projectId: "food-del-66e22",
  storageBucket: "food-del-66e22.firebasestorage.app",
  messagingSenderId: "70727244191",
  appId: "1:70727244191:web:bcdd9356067f7df224c5aa",
  measurementId: "G-W3RG0GGSY2",
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

// Register the service worker
navigator.serviceWorker
  .register("/firebase-messaging-sw.js")
  .then((registration) => {
    console.log("Service Worker registered:", registration);

    // Pass the registration to messaging
    // messaging.useServiceWorker(registration);
  })
  .catch((error) => {
    console.error("Service Worker registration failed:", error);
  });

// Request FCM Token
export const requestFCMToken = async () => {
  try {
    const token = await getToken(messaging, {
      vapidKey: "BCVheKtDS8w9AfOC7TQsDOdCf7bE24WHoZsQpQPIWCILco2ksk7BK_6gYrGCyvfdBiNKua-RlO4Hcg4vfBSJgjw",
    });
    console.log("FCM Token:", token);
    return token;
  } catch (error) {
    console.error("Error getting FCM token:", error);
    throw error;
  }
};
onMessage(messaging, (payload) => {
  console.log("Message received. ", payload);
  alert(`Notification: ${payload.notification.title}`);
});

export { messaging };
