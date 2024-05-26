import {FieldValue, getFirestore} from "firebase-admin/firestore";
import {Collections, UniversityDegree, UserRegisteredModule, universityModule, userRegisteredDegree as userDegreeValidator, userModuleFunctionDatatype} from "@cos720project/shared";
import {HttpsError, onCall} from "firebase-functions/v2/https";
import {validateUserClaim} from "../helpers/validate-claim";


export const createDegreeRegistration = onCall({cors : true},async (request) => {
  validateUserClaim(request.auth);
  try {
    const validatedUserDegree = userDegreeValidator.parse(request.data);
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
    if (request.auth!.uid != validatedUserDegree.userId) {
      console.warn("A user attempted to create a document with a dangling user id: auth" + request.auth?.token.uid + " -/-> userId: " + request.auth!.uid);
      throw new HttpsError("invalid-argument", "Incongruent userId provided: auth token and userId do not match");
    }
    const degree = degreeSnapshot.data() as UniversityDegree;
    if (degree.discontinued) {
      console.warn("A user attempted to register for a discontinued degree id: auth" + request.auth?.token.uid + " -/-> userId: " + request.auth!.uid);
      throw new HttpsError("invalid-argument", "Cannot register for discontinued degree");
    }
    const userDegreeSnapshots = await db.collection(Collections.userDegree)
      .where("userId", "==", request.auth!.uid)
      .get();
    userDegreeSnapshots.docs.forEach((doc) => {
      if (doc.data().degreeId == validatedUserDegree.degreeId) throw new HttpsError("already-exists","You have already registered for this degree");
    })
    const degreeDuration = degree.duration;
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


export const registerModule = onCall({cors : true},async (request) => {
  validateUserClaim(request.auth);
  try {
    const validatedRequest = userModuleFunctionDatatype.parse(request.data);
    const db = getFirestore();
    const userDegreeSnapshot = await db.collection(Collections.userDegree)
      .doc(validatedRequest.userDegreeId)
      .get();

    // check owner of degree
    if (!userDegreeSnapshot.exists) {
      console.warn("A user attempted to modify a document they do not own, and that doesn't exist: auth" + request.auth?.token.uid + " -/-> userId: " + request.auth!.uid);
      throw new HttpsError("invalid-argument", "Incongruent userId provided: auth token and userId do not match");
    }
    const userDegree = userDegreeValidator.parse(userDegreeSnapshot.data());
    if (userDegree.userId != request.auth?.uid) {
      console.warn("A user attempted to modify a document they do not own: auth" + request.auth?.token.uid + " -/-> userId: " + request.auth?.uid);
      throw new HttpsError("invalid-argument", "Incongruent userId provided: auth token and userId do not match");
    }

    // check module isn't already registered
    if (userDegree.enrolledModules.map((module)=>module.moduleId).includes(validatedRequest.moduleId)) {
      throw new HttpsError("invalid-argument", "Duplicate module registration");
    }

    // get module
    const moduleSnapshot = await db.collection(Collections.modules)
      .doc(validatedRequest.moduleId)
      .get();
    if (!moduleSnapshot.exists) throw new HttpsError("not-found", "Module not found");
    const module = universityModule.parse(moduleSnapshot.data());

    // check that module is not discontinued
    if (module.discontinued) {
      console.warn("A user attempted to register for a discontinued module: auth" + request.auth?.token.uid + " -/-> userId: " + request.auth?.uid);
      throw new HttpsError("invalid-argument", "You cannot register for discontinued modules");
    }
    // pre-requisites
    const completedModules = userDegree.enrolledModules
      .filter((module) => {module.status == "completed"})
      .map((module) => module.moduleId);
    const meetsPrerequisites = module.prerequisites.map((prerequisite) => {
      return prerequisite.every((moduleId)=> completedModules.includes(moduleId));
    })
    if (meetsPrerequisites.length > 0 && !meetsPrerequisites.includes(true)) {
      throw new HttpsError("invalid-argument","The pre-requisites for the module are not met by the user")
    }

    const newModuleRegistration:UserRegisteredModule = {
      status : "enrolled",
      registrationDate : new Date(),
      moduleId : validatedRequest.moduleId,
      deregisterable : true
    };
    userDegreeSnapshot.ref.update({enrolledModules : FieldValue.arrayUnion(newModuleRegistration)})
  } catch (error) {
    if (error instanceof HttpsError) throw error;
    console.log(error);
    throw new HttpsError("invalid-argument","The parameters passed with this request are invalid.")
  }
});

export const deregisterModule = onCall({cors : true},async (request) => {
  validateUserClaim(request.auth);

  const parsedRequest = userModuleFunctionDatatype.parse(request.data);
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
