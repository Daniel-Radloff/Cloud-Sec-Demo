import { getFirebaseAdminAuth } from "$lib/firebase/firebase.server";
import type {DecodedIdToken} from "firebase-admin/auth"
import { redirect, type Handle } from "@sveltejs/kit";
import { sequence } from "@sveltejs/kit/hooks";

const authGuard: Handle = async ({event, resolve}) => {
  const firebaseSessionCookie = event.cookies.get("session");
  try {
    const token:DecodedIdToken = await getFirebaseAdminAuth()
      .verifySessionCookie(firebaseSessionCookie!);
    event.locals.firebaseAuthToken = token;
  } catch (error) {
    event.locals.firebaseAuthToken = undefined;
  }
  return resolve(event);
};

// validate RBAC claims for protected routes
const routeGuards: Handle = async ({event, resolve}) => {
  // logged in validation
  if (process.env.IGNORE_AUTH === "TRUE") {
    return resolve(event);
  }
  if (event.url.pathname.startsWith("/home")) {
    if (!event.locals.firebaseAuthToken) {
      throw redirect(303, "/");
    }
  }
  if (event.url.pathname.startsWith("/home/admin")) {
    if (!event.locals.firebaseAuthToken) {
      throw redirect(303, "/");
    }
    if (!(event.locals.firebaseAuthToken?.admin === true)) {
      throw redirect(303, "/home");
    }
  }
  return resolve(event);
};

export const handle = sequence(authGuard,routeGuards);