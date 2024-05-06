import {initializeApp} from "firebase-admin";
import {adminUserCollectionUpdateHook} from "./adminuser-hooks/adminuser-hooks";
import {metadataSignupHook} from "./metadata-hooks/metadata-hooks";

// // Start writing functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

initializeApp();

export {
  adminUserCollectionUpdateHook,
  metadataSignupHook,
};
