import {Collections} from "@cos720project/shared";
import {
  onDocumentCreated,
} from "firebase-functions/v2/firestore";

export const userDegreeCreatedHook =
  onDocumentCreated(Collections.userDegree + "/{id}", async (event) => {
    if (!event.data) return;
    event.data.ref.update({id : event.data.id});
    console.log("Added new UserDegree: " + event.data.id + " to " + Collections.userDegree + " collection");
  });
