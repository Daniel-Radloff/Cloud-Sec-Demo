import admin from "firebase-admin";
import { applicationDefault } from "firebase-admin/app";


let firebaseAdmin:admin.app.App;
let firebaseAuth:admin.auth.Auth;

export const getFirebaseAdmin = ():admin.app.App => {
  if (firebaseAdmin) {
    return firebaseAdmin;
  }
  firebaseAdmin = admin.apps.length == 0 ? 
    admin.initializeApp({credential : applicationDefault()}): 
    admin.apps[0]!
  return firebaseAdmin;
};

export const getFirebaseAdminAuth = ():admin.auth.Auth => {
  if (firebaseAuth) {
    return firebaseAuth;
  }
  firebaseAuth = getFirebaseAdmin().auth();
  return firebaseAuth;
}