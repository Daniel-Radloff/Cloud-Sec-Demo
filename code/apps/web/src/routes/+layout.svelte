<script>
  import "../app.css";
  import { getFirebaseAuthClient, getFirebaseFirestoreClient } from "$lib/firebase/firebase.app";
  import { onAuthStateChanged } from "firebase/auth";
	import { userAuthInfo, userDegrees, userMetadata } from "../stores";
	import { get } from "svelte/store";
	import { onDestroy } from "svelte";
  import { Collections, userMetadata as userMetadataValidate } from '@cos720project/shared';
	import { doc, getDoc } from "firebase/firestore";

  const auth = getFirebaseAuthClient();
  onAuthStateChanged(auth,(user) => {
    if (user) {
      // signed in
      userAuthInfo.set(user);
      // get metadata
      if (get(userMetadata) == undefined) {
        const firestore = getFirebaseFirestoreClient();
        const clear = setInterval(async ()=>{
          try {
            const userId = get(userAuthInfo)?.uid;
            const userMetadataDocReference = doc(firestore,Collections.metadata,userId ? userId : "default")
            const userMetadataSnap = await getDoc(userMetadataDocReference);
            if (userMetadataSnap.exists()) {
              userMetadata.set(userMetadataValidate.parse(userMetadataSnap.data()))
              clearInterval(clear);
            }
          } catch (error) {
            console.log(error);
          }
        },1000)
      }
    } else {
      // logged out
      userAuthInfo.set(undefined);
      userMetadata.set(undefined);
      userDegrees.set(undefined);
    }
  })
</script>

<slot />
