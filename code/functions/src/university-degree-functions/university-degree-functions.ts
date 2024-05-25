import {getFirestore} from "firebase-admin/firestore";
import {Collections, universityDegree as universityDegreeValidator} from "@cos720project/shared";
import {HttpsError, onCall} from "firebase-functions/v2/https";
import {validateAdminClaim} from "../helpers/validate-claim";


export const addNewDegree = onCall((request) => {
  // validation
  validateAdminClaim(request.auth);
  try {
    const degree = universityDegreeValidator.parse(request.data);
    // set all potential undefined fields to undefined
    delete degree.coreModuleObjects
    delete degree.electiveModuleObjects;
    delete degree.id;
    degree.coreModules = [];
    degree.electiveModules = [];
    const db = getFirestore();
    db.collection(Collections.degrees).add(degree);
  } catch (e) {
    throw new HttpsError("invalid-argument","The parameters passed with this request are invalid.")
  }
});

export const modifyDegree = onCall((request) => {
  validateAdminClaim(request.auth);
  const validatedDegree = universityDegreeValidator.parse(request.data);
  const validDegreeObject = {...validatedDegree as any};
  // remove unmodifiable fields
  delete validDegreeObject.coreModuleObjects;
  delete validDegreeObject.electiveModuleObjects;
  delete validDegreeObject.id;
  delete validDegreeObject.name;
  delete validDegreeObject.code;
  delete validDegreeObject.department
  const db = getFirestore();
  console.log(validatedDegree);
  console.log(validDegreeObject);
  db.collection(Collections.degrees)
    .doc(validatedDegree.id!)
    .update(validDegreeObject);
});

