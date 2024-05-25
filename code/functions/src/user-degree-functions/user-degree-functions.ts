import {getFirestore} from "firebase-admin/firestore";
import {Collections, UniversityDegree, userRegisteredDegree as userDegreeValidator} from "@cos720project/shared";
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
      console.warn("A user provided degreeId does not exist, this is an anomaly, monitor behavior of this account");
      throw new HttpsError("invalid-argument", "An invalid degree id was provided");
    }
    if (request.auth!.token.uid != validatedUserDegree.userId) {
      console.warn("A user attempted to create a document with a dangling user id: auth" + request.auth?.token.uid + " -/-> userId: " + validatedUserDegree.userId);
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
    if (request.auth!.uid != validatedUserDegree.userId) {
      console.warn("A user attempted to modify a document they do not own: auth" + request.auth?.token.uid + " -/-> userId: " + validatedUserDegree.userId);
      throw new HttpsError("invalid-argument", "Incongruent userId provided: auth token and userId do not match");
    }
    // TODO validate checks
    const db = getFirestore();
    db.collection(Collections.userDegree)
      .doc(validatedUserDegree.id!)
      .update({ enrolledModules : validatedUserDegree.enrolledModules})
  } catch (error) {
    if (error instanceof HttpsError) throw error;
    console.log(error);
    throw new HttpsError("invalid-argument","The parameters passed with this request are invalid.")
  }
});

export const degregisterModule = onCall(async (request) => {
  validateUserClaim(request.auth);
  try {
    //let validatedUserDegree = userDegreeValidator.parse(request.data);

  } catch (error) {
    if (error instanceof HttpsError) throw error;
    console.log(error);
    throw new HttpsError("invalid-argument","The parameters passed with this request are invalid.")
  }
});
