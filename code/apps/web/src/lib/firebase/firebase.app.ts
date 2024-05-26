import {
  initializeApp,
  type FirebaseApp
} from "firebase/app";
import {connectAuthEmulator, getAuth, type Auth} from "firebase/auth";
import {getAnalytics, type Analytics} from "firebase/analytics"
import {connectFunctionsEmulator, getFunctions, type Functions} from "firebase/functions";
import {connectFirestoreEmulator, getFirestore, type Firestore} from "firebase/firestore";

const config = {
  apiKey: "AIzaSyDmFzS56wtmM7e7V2AQh7Rvk_VHEsqL2dg",
  authDomain: "cos720-4f6dc.firebaseapp.com",
  projectId: "cos720-4f6dc",
  storageBucket: "cos720-4f6dc.appspot.com",
  messagingSenderId: "1020977349995",
  appId: "1:1020977349995:web:f8e7cb62c27eb288eab82e",
  measurementId: "G-WYHVJPDPSJ"
};

let firebaseAuth:Auth;
let firebaseApp:FirebaseApp;
let firebaseAnalytics:Analytics;
let firebaseFunctions:Functions;
let firebaseFirestore:Firestore;

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
      connectAuthEmulator(firebaseAuth, "http://127.0.0.1:9099");
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
      connectFunctionsEmulator(firebaseFunctions,'127.0.0.1',5001);
    }
  }
  return firebaseFunctions;
}

export const getFirebaseFirestoreClient = ():Firestore => {
  if (!firebaseFirestore) {
    firebaseFirestore  = getFirestore(getFirebaseAppClient());
    if (import.meta.env.DEV === true) {
      console.log("using emulator")
      connectFirestoreEmulator(firebaseFirestore, '127.0.0.1', 8080)
    }
  }
  return firebaseFirestore;
}

getFirebaseAppClient();
getFirebaseFirestoreClient();
getFirebaseFunctionsClient();
getFirebaseAuthClient();
