import {
  onDocumentCreated,
  onDocumentUpdated,
} from "firebase-functions/v2/firestore";
import {Collections, universityDegree as universityDegreeValidator} from "@cos720project/shared";
import {getFirestore} from "firebase-admin/firestore";


export const universityDegreeCreatedHook =
  onDocumentCreated(Collections.degrees+ "/{id}", async (event) => {
    if (!event.data) return;
    const db = getFirestore();
    Promise.resolve(db.collection(Collections.degrees)
      .doc(event.data.id)
      .update({id: event.data.id}));
    console.log("Added New Degree: " + event.data.id + " to " + Collections.degrees + " collection");
});

const notifyUsersOfModuleRemoval = async (moduleIds:string[],degreeId:string) => {
  const db = getFirestore();
  const invalidDegreeQueries = moduleIds.flatMap(async (moduleId) => {
    return await db.collection(Collections.userDegree)
    .where("status", "==", "active")
    .where("enrolledModules", "array-contains", {moduleId: moduleId,status:"enrolled"})
    .get();
  });
  const invalidDegrees = invalidDegreeQueries.flatMap(async (promise) => {
    const query = await promise;
    return query.docs.filter((doc) => doc.exists)
  });
  invalidDegrees.forEach((invalidDegree) => {
  });
};

export const universityDegreeUpdatedHook =
  onDocumentUpdated(Collections.degrees + "/{id}", async (event) => {

    if (!event.data) return;
    // checking module fields
    const original = universityDegreeValidator.parse(event.data.before);
    const modified = universityDegreeValidator.parse(event.data.after);

    const addedCoreModules = modified.coreModules.filter((module) => !original.coreModules.includes(module));
    const addedElectiveModules = modified.electiveModules.filter((module) => !original.electiveModules.includes(module));
    const removedCoreModules = original.coreModules.filter((module) => !modified.coreModules.includes(module));
    const removedElectiveModules = original.electiveModules.filter((module) => !modified.electiveModules.includes(module));

    if (addedCoreModules.length > 0) console.log("Core Modules have been added to: " + original.code + ", id: " + original.id);
    if (addedElectiveModules.length > 0) console.log("Elective Modules have been added to: " + original.code + ", id: " + original.id);

    if (removedCoreModules.length > 0) {
      console.warn("Core Modules have been removed from: " + original.code + ", id: " + original.id)
      notifyUsersOfModuleRemoval(removedCoreModules, original.id!);
    }
    if (removedElectiveModules.length > 0) {
      console.warn("Elective Modules have been removed from: " + original.code + ", id: " + original.id)
      notifyUsersOfModuleRemoval(removedElectiveModules, original.id!);
    }

    //

    const db = getFirestore();
    const reference = await db.collection("degreesBackup").add(original);
    console.log("Backup Created of " + original.code + ".degrees/" + original.id + " -> degreesBackup" + reference.id)
});
