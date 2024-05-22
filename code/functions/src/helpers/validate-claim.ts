import {AuthData} from "firebase-functions/lib/common/providers/tasks";
import {HttpsError} from "firebase-functions/v1/auth";

/**
 * @throws {HttpsError}
 */
export const validateAdminClaim = (token:undefined|AuthData):boolean => {
  if (!token) throw new HttpsError("unauthenticated","You must be authenticated to use this service");
  const adminClaim = token.token.admin;
  if (adminClaim !== true) throw new HttpsError("permission-denied", "You have insufficient privilages to access this resource");
  return true;
};
