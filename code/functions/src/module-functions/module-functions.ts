import {getFirestore} from "firebase-admin/firestore";
import {Collections, universityModule as moduleValidator} from "@cos720project/shared";
import {HttpsError, onCall} from "firebase-functions/v2/https";
import {validateAdminClaim} from "../helpers/validate-claim";


export const addModule = onCall((request) => {
  validateAdminClaim(request.auth);
  try {
    let validatedModule = moduleValidator.parse(request.data);
    // set fields that must be undefined to undefined
    validatedModule.discontinued = undefined;
    validatedModule.id = undefined;
    validatedModule.prerequisiteObjects = undefined;
    const nameSearchField = validatedModule.name.split('');
    const codeSearchField = validatedModule.code.split('');
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
