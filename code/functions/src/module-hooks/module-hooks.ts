import {
  onDocumentCreated,
  onDocumentUpdated,
} from "firebase-functions/v2/firestore";
import {Collections, NotificationData, universityModule as moduleValidator, userRegisteredDegree as userDegreeValidator} from "@cos720project/shared";
import {FieldValue, getFirestore} from "firebase-admin/firestore";

export const validatePrerequisites = async (potentialPrerequisites:string[][], moduleId:string) => {
  const db = getFirestore();
  const userMetadataBatch = db.batch();
  const userRegisteredDegreeBatch = db.batch();

  const documents = await db.collection(Collections.userDegree)
    .where("enrolledModules", "array-contains", {moduleId : moduleId, status : "enrolled"})
    .get();

  const potentiallyInvalidDegreeRegistrations = documents.docs.map((doc) => userDegreeValidator.parse(doc));

  const invalidDegreeRegistrations = potentiallyInvalidDegreeRegistrations.filter((degree) => {
    const completedModuleIds = degree.enrolledModules
      .filter((module) => module.status == "completed")
      .map((module) => module.moduleId);

    return potentialPrerequisites
      .map((prerequisites) => {
        return prerequisites.every((module) => completedModuleIds.includes(module));
      })
      .includes(true);
  });

  invalidDegreeRegistrations.forEach((invalidDegree) => {
    const userDegreeId = invalidDegree.id!;
    const userId = invalidDegree.userId;
    const notification:NotificationData = {
      type : "registration",
      message : "The prerequisites for one of the modules you are registered for has changed and you no longer are eligible to enroll, please update your registration details"
    };
    const updatedModules = invalidDegree.enrolledModules.map((module) => {
      if (module.moduleId == moduleId) {
        module.status = "prerequisites not satisfied";
      }
      return module;
    });
    userMetadataBatch.update(
      db.collection(Collections.metadata).doc(userId),
      {notificationData : FieldValue.arrayUnion(notification)}
    );
    userRegisteredDegreeBatch.update(
      db.collection(Collections.userDegree).doc(userDegreeId),
      {enrolledModules : updatedModules}
    );

  });
  userMetadataBatch.commit();
  userRegisteredDegreeBatch.commit();
};

export const discontinueModule = async (moduleId:string) => {
  const db = getFirestore();
  const userMetadataBatch = db.batch();
  const userRegisteredDegreeBatch = db.batch();

  const documents = await db.collection(Collections.userDegree)
    .where("enrolledModules", "array-contains", {moduleId : moduleId, status : "enrolled"})
    .get()

  const invalidDegreeRegistrations = documents.docs.map((doc) => userDegreeValidator.parse(doc));

  invalidDegreeRegistrations.forEach((invalidDegree) => {
    const userDegreeId = invalidDegree.id!;
    const userId = invalidDegree.userId;
    const notification: NotificationData = {
      type : "registration",
      message : "The module you have registered for has been discontinued, please update your registration information"
    };
    const updatedModules = invalidDegree.enrolledModules.map((module) => {
      if (module.moduleId == moduleId) {
        module.status = "discontinued";
      }
      return module;
    });
    userMetadataBatch.update(
      db.collection(Collections.metadata).doc(userId),
      {notificationData : FieldValue.arrayUnion(notification)}
    );
    userRegisteredDegreeBatch.update(
      db.collection(Collections.userDegree).doc(userDegreeId),
      {enrolledModules : updatedModules}
    );

  });
  userMetadataBatch.commit();
  userRegisteredDegreeBatch.commit();

};

export const moduleCreatedHook =
  onDocumentCreated(Collections.modules+ "/{id}", async (event) => {
    if (!event.data) return;
    event.data.ref.update({id : event.data.id});
    console.log("Added New Module: " + event.data.id + " to " + Collections.modules + " collection");
  });

export const moduleUpdatedHook =
  onDocumentUpdated(Collections.modules + "/{id}", async (event) => {
    if (!event.data) return;
    // should never happen but warn
    if (!event.data.before.exists) return;
    if (!event.data.after.exists) return;
    const db = getFirestore();
    if (event.data.before.id !== event.data.after.data().id || event.data.before.id !== event.data.after.id) {
      event.data.after.ref.set(event.data.before.data());
      return;
    }
    if (event.data.before.data().id === undefined) {
      return;
    }

    const original = moduleValidator.parse(event.data.before.data());
    const modified = moduleValidator.parse(event.data.after.data());

    const addedPrerequisites = modified.prerequisites.filter((module) => !original.prerequisites.includes(module));
    const removedPrerequisites = original.prerequisites.filter((module) => !modified.prerequisites.includes(module));

    // not going to be pretty but efficiency does not matter
    // this is a very rare operation
    if (addedPrerequisites.length > 0) console.log("New Prerequisites have been made availible to: " + original.code + ", id: " + original.id);
    if (removedPrerequisites.length > 0) {
      console.warn("Core Modules have been removed from: " + original.code + ", id: " + original.id)
      validatePrerequisites(modified.prerequisites, original.id!);
    }

    // checking if discontinued
    if (modified.discontinued) discontinueModule(modified.id!);

    const reference = await db.collection("modulesBackup").add(original);
    console.log("Backup Created of " + original.code + ".modules/" + original.id + " -> modulesBackup" + reference.id)
  });
