import {
  initializeApp,
  type FirebaseOptions,
  type FirebaseApp
} from "firebase/app";
import {connectAuthEmulator, getAuth, type Auth} from "firebase/auth";
import {getAnalytics, type Analytics} from "firebase/analytics"
import {connectFunctionsEmulator, getFunctions, type Functions} from "firebase/functions";

const config: FirebaseOptions = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

let firebaseAuth:Auth;
let firebaseApp:FirebaseApp;
let firebaseAnalytics:Analytics;
let firebaseFunctions:Functions;

export const getFirebaseAppClient = ():FirebaseApp => {
  if (!firebaseApp) {
    firebaseApp = initializeApp(config);
  }
  return firebaseApp;
};

export const getFirebaseAuthClient = ():Auth => {
  if (!firebaseAuth) {
    firebaseAuth = getAuth(getFirebaseAppClient());
    if (import.meta.env.DEV === true) {
      connectAuthEmulator(firebaseAuth, "http://localhost:9099");
    }
  }
  return firebaseAuth;
};

export const getFirebaseAnalyticsClient = ():Analytics => {
  if (!firebaseAnalytics) {
    firebaseAnalytics = getAnalytics(getFirebaseAppClient());
  }
  return firebaseAnalytics;
}

export const getFirebaseFunctionsClient = ():Functions => {
  if (!firebaseFunctions) {
    firebaseFunctions = getFunctions(getFirebaseAppClient());
    if (import.meta.env.DEV === true) {
      connectFunctionsEmulator(firebaseFunctions,'localhost',5001);
    }
  }
  return firebaseFunctions;
}

getFirebaseAppClient();