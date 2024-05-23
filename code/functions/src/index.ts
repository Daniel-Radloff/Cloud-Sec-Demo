import * as firebase from "firebase-admin";
import * as adminUserHooks  from "./adminuser-hooks/adminuser-hooks";
import * as metadataHooks from "./metadata-hooks/metadata-hooks";
import * as moduleFunctions from "./module-functions/module-functions";
import * as moduleHooks from "./module-hooks/module-hooks";

// // Start writing functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

firebase.initializeApp();

export {
  adminUserHooks,
  metadataHooks,
  moduleFunctions,
  moduleHooks
};
