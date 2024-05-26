<script lang="ts">
  import "../app.css";
  import { getFirebaseAuthClient, getFirebaseFirestoreClient } from "$lib/firebase/firebase.app";
  import { onAuthStateChanged, type Unsubscribe } from "firebase/auth";
	import { userAuthInfo, userDegrees, userMetadata } from "../stores";
  import {browser} from "$app/environment";
	import { onDestroy, onMount } from "svelte";
  import { Collections, userMetadata as userMetadataValidate } from '@cos720project/shared';
	import { doc, getDoc, onSnapshot } from "firebase/firestore";
	import { Toaster } from "svelte-sonner";
	import { page } from "$app/stores";
	import { redirect } from "@sveltejs/kit";
	import { goto } from "$app/navigation";

  let unsubscribe:Unsubscribe|undefined;
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

          unsubscribe = onSnapshot(userMetadataDocReference, (data) => {
            if (data.exists()) {
              userMetadata.set(userMetadataValidate.parse(data.data()));
            }
          });
        } catch (error) {
          console.log(error);
          if (unsubscribe) unsubscribe();
        }
      } else {
        // logged out
        if (unsubscribe) unsubscribe();
        userAuthInfo.set(undefined);
        userMetadata.set(undefined);
        userDegrees.set([]);
        fetch("/logout",{
          method: 'POST',
          credentials : 'same-origin'
        });
      }
    })
  })
  let debounce:NodeJS.Timeout;
  userAuthInfo.subscribe((userAuth) => {
    if (!browser) return
    clearTimeout(debounce);
    debounce = setTimeout(async ()=>{
      const token = await userAuth?.getIdTokenResult();
      if (token === undefined) {
        goto("/");
        return;
      }
      if ($page.url.pathname.startsWith("/home/admin")) {
        if (token?.claims.admin !== true) {
          goto("/home");
          return;
        };
      }
      if ($page.url.pathname == "/") {
        if (token?.claims.admin === true) {
          goto("/home/admin");
          return;
        }
        if (token?.claims.user === true) {
          goto("/home");
          return;
        }
      }
    },300);
  });
</script>
<Toaster/>
<slot />
