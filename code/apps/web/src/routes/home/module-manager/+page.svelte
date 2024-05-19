<script lang="ts">
  import type { PageData } from './$types';
  import {ModuleManagerTable} from '$lib/components/ui/module-manager-table';
	import { userAuthInfo, userDegrees } from '../../../stores';
	import { get } from 'svelte/store';
	import { getFirebaseFirestoreClient } from '$lib/firebase/firebase.app';
	import { onDestroy } from 'svelte';
	import { Collections } from '@cos720project/shared';
	import { doc, getDoc } from 'firebase/firestore';
  
  //export let data: PageData;
  let isLoading = true;
  const loadUserData = async () => {
    if (get(userDegrees) == undefined) {
      const firestore = getFirebaseFirestoreClient();
      const clear = setInterval(async ()=>{
        try {
          const userId = get(userAuthInfo)?.uid;
          const userMetadataDocReference = doc(firestore,Collections.userDegree,userId ? userId : "default")
          const userMetadataSnap = await getDoc(userMetadataDocReference);
          if (userMetadataSnap.exists()) {
            userDegrees.set(userMetadataValidate.parse(userMetadataSnap.data()))
            isLoading = false;
            clearInterval(clear);
          }
        } catch (error) {
          console.log(error);
        }
      },1000)
      onDestroy(() => clearInterval(clear))
    } else {
      isLoading = false;
    }
  }
  loadUserData();
</script>
<ModuleManagerTable/>