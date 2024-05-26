<script lang="ts">
  import { UserServices } from '$lib/app-constants';
  import { HomeCardButton } from '$lib/components/ui/home-card-button';
  import { userAuthInfo, userMetadata } from '../../stores';
	import { awaitStore } from '$lib/functions';
	import { onMount } from 'svelte';
  import {goto} from "$app/navigation";
  //export let data: PageData;
  
  let isLoading = true;

  onMount(async ()=> {
    if ($userMetadata == undefined) {
      // lambda to await store before loading data
      userMetadata.subscribe((value) => value ? isLoading = false : isLoading = true);
    } else {
      isLoading = false;
    }
  });
</script>
<div class="flex flex-wrap justify-center">
  {#each UserServices as service}
  <HomeCardButton href={service.href} image_url={service.image_url} service_name={service.service_name} loading={isLoading}/>
  {/each}
</div>