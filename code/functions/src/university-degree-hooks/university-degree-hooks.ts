import {
  onDocumentCreated,
  onDocumentUpdated,
} from "firebase-functions/v2/firestore";
import {Collections, NotificationData, universityDegree as universityDegreeValidator, userRegisteredDegree as userDegreeValidator} from "@cos720project/shared";
import {FieldValue, getFirestore} from "firebase-admin/firestore";


const notifyUsersOfModuleRemoval = async (moduleIds:string[],degreeId:string) => {
  const db = getFirestore();
  const userMetadataBatch = db.batch();
  const userRegisteredDegreeBatch = db.batch();

  const invalidDegreeQueries = moduleIds.map((moduleId) => {
    return db.collection(Collections.userDegree)
    .where("degreeId", "==", degreeId)
    .where("status", "==", "active")
    .where("enrolledModules", "array-contains", {moduleId: moduleId,status:"enrolled"});
  });
  const querySnapshots = await Promise.all(invalidDegreeQueries.map((query) => query.get()));
  const invalidDegrees = querySnapshots.flatMap((snapshot) => {
    return snapshot.docs
      .filter((doc) => doc.exists)
      .map((doc)=> userDegreeValidator.parse(doc.data));
  });

  invalidDegrees.forEach((invalidDegree) => {
    const userId = invalidDegree.userId;
    const docId = invalidDegree.id!;
    const notificationData:NotificationData =  {
      type : "registration",
      message : "One or more modules you are registered for have been discontinued, please update your registration information."
    }
    let updatedModules = invalidDegree.enrolledModules.map((module) => {
      if (moduleIds.includes(module.moduleId)) {
	module.status = "discontinued";
      }
      return module;
    });

    userMetadataBatch.update(
      db.collection(Collections.metadata).doc(userId),
      {notificationData : FieldValue.arrayUnion(notificationData)}
    );
    userRegisteredDegreeBatch.update(
      db.collection(Collections.userDegree).doc(docId),
      {enrolledModules : updatedModules}
    );
  });
  userMetadataBatch.commit();
  userRegisteredDegreeBatch.commit();
};

export const universityDegreeCreatedHook =
  onDocumentCreated(Collections.degrees+ "/{id}", async (event) => {
    if (!event.data) return;
    event.data.ref.update({id: event.data.id});
    console.log("Added New Degree: " + event.data.id + " to " + Collections.degrees + " collection");
});


export const universityDegreeUpdatedHook =
  onDocumentUpdated(Collections.degrees + "/{id}", async (event) => {
    if (!event.data) return;
    // should never happen but warn
    if (!event.data.before.exists) return;
    if (!event.data.after.exists) return;
    const db = getFirestore();
    if (event.data.before.id !== event.data.after.data().id || event.data.before.id !== event.data.after.id) {
	event.data.after.ref.set(event.data.before.data());
	return;
    }

    if (!event.data) return;
    // checking module fields
    const original = universityDegreeValidator.parse(event.data.before.data());
    const modified = universityDegreeValidator.parse(event.data.after.data());

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

    // checking if discontinued
    if (original.discontinued === modified.discontinued) {
    }

    const reference = await db.collection("degreesBackup").add(original);
    console.log("Backup Created of " + original.code + ".degrees/" + original.id + " -> degreesBackup" + reference.id)
});
