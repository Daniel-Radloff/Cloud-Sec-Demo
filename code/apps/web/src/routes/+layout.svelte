<script>
  import "../app.css";
  import { getFirebaseAuthClient } from "$lib/firebase/firebase.app";
  import { onAuthStateChanged } from "firebase/auth";
	import { userAuthInfo, userDegrees, userMetadata } from "../stores";

  const auth = getFirebaseAuthClient();
  onAuthStateChanged(auth,(user) => {
    if (user) {
      // signed in
      userAuthInfo.set(user);
    } else {
      // logged out
      userAuthInfo.set(undefined);
      userMetadata.set(undefined);
      userDegrees.set(undefined);
    }
  })
</script>

<slot />
