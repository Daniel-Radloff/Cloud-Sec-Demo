import {getAuth} from "firebase-admin/auth";
import {getFirestore} from "firebase-admin/firestore";
import * as functions from "firebase-functions";
import {Collections, userMetadata} from "appTypes";

export const metadataSignupHook =
functions.auth.user().onCreate(async (user) => {
  const defaultClaims = {
    user: true,
    accessLevel: 1,
  };
  try {
    await getAuth().setCustomUserClaims(user.uid, defaultClaims);
    const metadata = {
      securityInformation: {
        username: user.displayName,
        accountEmail: user.email,
      },
    };
    const validatedMetadata = userMetadata.parse(metadata);
    await getFirestore().collection(Collections.metadata)
      .doc(user.uid)
      .set(validatedMetadata);
  } catch (error) {
    console.log(error);
    // TODO delete user and clean up.
  }
});

