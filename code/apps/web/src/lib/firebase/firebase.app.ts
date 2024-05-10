import {
  initializeApp,
  getApps,
  type FirebaseApp,
  type FirebaseOptions
} from "firebase/app";
import {getAuth} from "firebase/auth";
import {getAnalytics} from "firebase/analytics"

const config: FirebaseOptions = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
  measurementId: process.env.VITE_FIREBASE_MEASUREMENT_ID,
};

let firebaseApp: FirebaseApp | undefined;
if (!getApps().length) {
   firebaseApp = initializeApp(config);
} else {
   firebaseApp = getApps()[0];
}

const firebaseAuth = getAuth(firebaseApp);
const firebaseAnalytics = getAnalytics(firebaseApp);

export {
  firebaseApp,
  firebaseAuth,
  firebaseAnalytics
};