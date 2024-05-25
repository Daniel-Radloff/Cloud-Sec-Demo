import {getFirestore} from "firebase-admin/firestore";
import {Collections, universityModule as moduleValidator} from "@cos720project/shared";
import {HttpsError, onCall} from "firebase-functions/v2/https";
import {validateAdminClaim} from "../helpers/validate-claim";


export const addModule = onCall((request) => {
  validateAdminClaim(request.auth);
  try {
    const validatedModule = moduleValidator.parse(request.data);
    // set fields that must be undefined to undefined
    delete validatedModule.discontinued;
    delete validatedModule.id;
    delete validatedModule.prerequisiteObjects;
    const db = getFirestore();
    db.collection(Collections.modules).add(validatedModule);
  } catch (error) {
    throw new HttpsError("invalid-argument","The parameters passed with this request are invalid.")
  }
});

export const updateModulePrerequisites = onCall((request) => {
  validateAdminClaim(request.auth);
  const validatedModule = moduleValidator.parse(request.data);
  const db = getFirestore();
  db.collection(Collections.modules)
    .doc(validatedModule.id!)
    .update({prerequisites:validatedModule.prerequisites});
});

// notify user
export const updateModulePresentationTime = onCall((request) => {
  validateAdminClaim(request.auth);
});

// notify user
export const updateModuleCredits = onCall((request) => {
  validateAdminClaim(request.auth);
});

export const updateModuleDisplayInformation = onCall((request) => {
  validateAdminClaim(request.auth);
});

export const discontinueModule = onCall((request) => {
  validateAdminClaim(request.auth);
  const validatedModule = moduleValidator.parse(request.data);
  const db = getFirestore();
  db.collection(Collections.modules)
    .doc(validatedModule.id!)
    .update({discontinued:true});
});
