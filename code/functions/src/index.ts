import {initializeApp} from "firebase-admin/app";
import * as adminUserHooks  from "./adminuser-hooks/adminuser-hooks";
import * as metadataHooks from "./metadata-hooks/metadata-hooks";
import * as moduleFunctions from "./module-functions/module-functions";
import * as moduleHooks from "./module-hooks/module-hooks";
import * as universityDegreeHooks from "./university-degree-hooks/university-degree-hooks";
import * as universityDegreeFunctions from "./university-degree-functions/university-degree-functions";
import * as userDegreeFunctions from "./user-degree-functions/user-degree-functions";
import * as userDegreeHooks from "./user-degree-hooks/user-degree-hooks";

// // Start writing functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

initializeApp();

export {
  adminUserHooks,
  metadataHooks,
  moduleHooks,
  moduleFunctions,
  universityDegreeHooks,
  universityDegreeFunctions,
  userDegreeHooks,
  userDegreeFunctions,
};
