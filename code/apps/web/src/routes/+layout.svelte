<script lang="ts">
  import "../app.css";
  import { getFirebaseAuthClient, getFirebaseFirestoreClient } from "$lib/firebase/firebase.app";
  import { onAuthStateChanged } from "firebase/auth";
	import { userAuthInfo, userDegrees, userMetadata } from "../stores";
	import { onDestroy, onMount } from "svelte";
  import { Collections, userMetadata as userMetadataValidate } from '@cos720project/shared';
	import { doc, getDoc } from "firebase/firestore";

  onMount(() => {
    const auth = getFirebaseAuthClient();
    onAuthStateChanged(auth,(user) => {
      if (user) {
        // signed in
        userAuthInfo.set(user);
        // get metadata
        const firestore = getFirebaseFirestoreClient();
        try {
          const userId = $userAuthInfo!.uid;
          const userMetadataDocReference = doc(firestore,Collections.metadata,userId)
          const userMetadataSnap = getDoc(userMetadataDocReference);
          userMetadataSnap.then((data) => {
            if (data.exists()) {
              userMetadata.set(userMetadataValidate.parse(data.data()))
            }
          }).catch((reason) => {
            console.log(reason);
          });
        } catch (error) {
          console.log(error);
        }
      } else {
        // logged out
        userAuthInfo.set(undefined);
        userMetadata.set(undefined);
        userDegrees.set(undefined);
      }
    })
  })
</script>

<slot />
