<script lang="ts">
  import { UserServices } from '$lib/app-constants';
  import { HomeCardButton } from '$lib/components/ui/home-card-button';
  import { userMetadata } from '../../stores';
	import { awaitStore } from '$lib/functions';
	import { onMount } from 'svelte';
  //export let data: PageData;
  
  let isLoading = true;

  onMount(()=> {
    if ($userMetadata == undefined) {
      (async () => {
        try {
          isLoading = !(await awaitStore(userMetadata));
        } catch (error) {
          console.error(error);
        }
      })()
    } else {
      isLoading = false;
    }
  })
</script>
<div class="flex flex-wrap justify-center">
  {#each UserServices as service}
  <HomeCardButton href={service.href} image_url={service.image_url} service_name={service.service_name} loading={isLoading}/>
  {/each}
</div>