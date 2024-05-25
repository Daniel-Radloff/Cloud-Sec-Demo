import {getFirestore} from "firebase-admin/firestore";
import {Collections, UniversityDegree, deregisterUserModuleFunctionDatatype, userRegisteredDegree as userDegreeValidator} from "@cos720project/shared";
import {HttpsError, onCall} from "firebase-functions/v2/https";
import {validateUserClaim} from "../helpers/validate-claim";


export const createDegreeRegistration = onCall(async (request) => {
  validateUserClaim(request.auth);
  try {
    let validatedUserDegree = userDegreeValidator.parse(request.data);
    // set fields that must be undefined to undefined
    delete validatedUserDegree.degree;
    delete validatedUserDegree.id;
    // validate userid and degreeId
    const db = getFirestore();
    const degreeSnapshot = await db.collection(Collections.degrees)
      .doc(validatedUserDegree.degreeId)
      .get();
    if (!degreeSnapshot.exists) {
      console.warn("A user provided degreeId does not exist, this is an anomaly, monitor behavior of this account: " + request.auth?.uid);
      throw new HttpsError("invalid-argument", "An invalid degree id was provided");
    }
    if (request.auth!.token.uid != validatedUserDegree.userId) {
      console.warn("A user attempted to create a document with a dangling user id: auth" + request.auth?.token.uid + " -/-> userId: " + request.auth!.uid);
      throw new HttpsError("invalid-argument", "Incongruent userId provided: auth token and userId do not match");
    }
    const degreeDuration = (degreeSnapshot.data() as UniversityDegree).duration;
    // overwrite variables
    validatedUserDegree.completedCredits = 0;
    validatedUserDegree.enrolledModules = [];
    validatedUserDegree.status = "active";
    validatedUserDegree.enrollmentDate = new Date();
    validatedUserDegree.expectedGraduationDate = new Date(validatedUserDegree.enrollmentDate);
    validatedUserDegree.expectedGraduationDate
      .setFullYear(validatedUserDegree.enrollmentDate.getFullYear() + degreeDuration);
    db.collection(Collections.userDegree).add(validatedUserDegree);
  } catch (error) {
    if (error instanceof HttpsError) throw error;
    console.log(error);
    throw new HttpsError("invalid-argument","The parameters passed with this request are invalid.")
  }
});


export const registerModule = onCall(async (request) => {
  validateUserClaim(request.auth);
  try {
    let validatedUserDegree = userDegreeValidator.parse(request.data);
    // TODO not good enough validation
    if (request.auth!.uid != validatedUserDegree.userId) {
      console.warn("A user attempted to modify a document they do not own: auth" + request.auth?.token.uid + " -/-> userId: " + request.auth?.uid);
      throw new HttpsError("invalid-argument", "Incongruent userId provided: auth token and userId do not match");
    }
    // TODO validate checks
    const update = validatedUserDegree.enrolledModules.map((userModule) => {
      const newObject = userModule;
      delete newObject.module;
      return newObject;
    })
    const db = getFirestore();
    db.collection(Collections.userDegree)
      .doc(validatedUserDegree.id!)
      .update({ enrolledModules : update})
  } catch (error) {
    if (error instanceof HttpsError) throw error;
    console.log(error);
    throw new HttpsError("invalid-argument","The parameters passed with this request are invalid.")
  }
});

export const deregisterModule = onCall(async (request) => {
  validateUserClaim(request.auth);

  const parsedRequest = deregisterUserModuleFunctionDatatype.parse(request.data);
  try {
    const db = getFirestore();
    const userDegreeSnapshot= await db.collection(Collections.userDegree)
      .doc(parsedRequest.userDegreeId)
      .get();
    if (!userDegreeSnapshot.exists) {
      console.warn("A user attempted to modify a document they do not own, and that doesn't exist: auth" + request.auth?.token.uid + " -/-> userId: " + request.auth!.uid);
      throw new HttpsError("invalid-argument", "Incongruent userId provided: auth token and userId do not match");
    }
    const userDegree = userDegreeValidator.parse(userDegreeSnapshot.data());
    if (userDegree.userId != request.auth?.uid) {
      console.warn("A user attempted to modify a document they do not own: auth" + request.auth?.token.uid + " -/-> userId: " + request.auth?.uid);
      throw new HttpsError("invalid-argument", "Incongruent userId provided: auth token and userId do not match");
    }
    const newModuleRegistration = userDegree.enrolledModules.filter((module) => module.moduleId != parsedRequest.moduleId);
    userDegreeSnapshot.ref.update({enrolledModules : newModuleRegistration})
  } catch (error) {
    if (error instanceof HttpsError) throw error;
    console.log(error);
    throw new HttpsError("invalid-argument","The parameters passed with this request are invalid.")
  }
});
