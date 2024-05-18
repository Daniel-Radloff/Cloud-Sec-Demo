<script lang="ts">
  import { UserServices } from '$lib/app-constants';
  import { HomeCardButton } from '$lib/components/ui/home-card-button';
  import { userAuthInfo, userMetadata } from '../../stores';
  import { get } from 'svelte/store';
  import { getFirebaseFirestoreClient } from '$lib/firebase/firebase.app';
  import { doc, getDoc} from 'firebase/firestore';
  import { Collections, userMetadata as userMetadataValidate } from '@cos720project/shared';
	import type { PageData } from '../$types';
  export let data: PageData;
  
  let isLoading = true;
  const loadUserData = async () => {
    if (get(userMetadata) == undefined) {
      const firestore = getFirebaseFirestoreClient();

      const clear = setInterval(async ()=>{
        try {
          const userId = get(userAuthInfo)?.uid;
          const userMetadataDocReference = doc(firestore,Collections.metadata,userId? userId : "")
          const userMetadataSnap = await getDoc(userMetadataDocReference);
          if (userMetadataSnap.exists()) {
            userMetadata.set(userMetadataValidate.parse(userMetadataSnap.data()))
            isLoading = false;
            clearInterval(clear);
          }
        } catch (error) {
          console.log(error);
        }
      },1000)
    }
  }
  loadUserData();
</script>
<div class="flex flex-wrap justify-center">
  {#each UserServices as service}
  <HomeCardButton href={service.href} image_url={service.image_url} service_name={service.service_name} loading={isLoading}/>
  {/each}
</div>