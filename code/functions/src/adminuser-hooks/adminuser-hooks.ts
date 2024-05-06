import {
  onDocumentCreated,
} from "firebase-functions/v2/firestore";
import {Collections} from "@cos720project/shared";
import {getFirestore} from "firebase-admin/firestore";

type AdminDocument = {
  name : string;
  email : string;
  privilage : string;
}


export const adminUserCollectionUpdateHook =
  onDocumentCreated("adminUsers/{humanId}", async (event) => {
    const db = getFirestore();
    // cast unknown, check fields, recast.
    let newAdmin: AdminDocument;
    try {
      newAdmin = event.data?.data() as AdminDocument;
      if (!newAdmin) {
        console.log("Warning: Anomaly in adminUsers collection events");
        console.log("No data accociated with onDocumentCreate event");
        return;
      }
    } catch (error) {
      console.log("Error: Anomaly in adminUsers collection events");
      console.log("Type conversion failed:");
      console.log("a document in the collection is malformed");
      console.log(error);
      // TODO: trigger delete event maybe
      return;
    }
    const adminAccount = await db.collection(Collections.metadata)
      .where("accountEmail", "==", newAdmin.email)
      .get();

    // debug trash, remove before push to prod
    console.log(adminAccount);
    // adminAccount.forEach(doc => {
    // })
  });
