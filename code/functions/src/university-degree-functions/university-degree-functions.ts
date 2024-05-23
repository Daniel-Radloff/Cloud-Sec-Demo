import {getFirestore} from "firebase-admin/firestore";
import {Collections, universityDegree as universityDegreeValidator} from "@cos720project/shared";
import {HttpsError, onCall} from "firebase-functions/v2/https";
import {validateAdminClaim} from "../helpers/validate-claim";


export const addNewDegree = onCall((request) => {
  // validation
  validateAdminClaim(request.auth);
  try {
    let degree = universityDegreeValidator.parse(request.data);
    // set all potential undefined fields to undefined
    degree.coreModuleObjects = undefined;
    degree.electiveModuleObjects = undefined;
    degree.id = undefined;
    const db = getFirestore();
    db.collection(Collections.degrees).add(degree);
  } catch (e) {
    throw new HttpsError("invalid-argument","The parameters passed with this request are invalid.")
  }
});

export const modifyModulesForDegree = onCall((request) => {
  validateAdminClaim(request.auth);
  const degree = universityDegreeValidator.parse(request.data);
  const {coreModules, electiveModules} = degree;
  const db = getFirestore();
  db.collection(Collections.degrees)
    .doc(degree.id!)
    .update({
      coreModules,
      electiveModules
    });
});

