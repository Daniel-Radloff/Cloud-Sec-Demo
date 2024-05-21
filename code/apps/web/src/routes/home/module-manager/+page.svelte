<script lang="ts">
  import type { PageData } from './$types';
  import {ModuleManagerTable} from '$lib/components/ui/module-manager-table';
	import { userAuthInfo, userDegrees } from '../../../stores';
	import { onMount } from 'svelte';
	import { awaitStore, loadDegreeStore } from '$lib/functions';
  import * as Tabs from "$lib/components/ui/tabs";
  import { Skeleton } from "$lib/components/ui/skeleton";
  
  //export let data: PageData;
  let isLoading = true;

  // TODO: If 0 degrees registered then message
  onMount(async () => {
    // await stores and load stuff
    await awaitStore(userAuthInfo);
    loadDegreeStore($userAuthInfo!.uid);
    if ($userDegrees.length == 0) {
      (async () => {
        isLoading = !(await awaitStore(userDegrees))
      })()
    } else {
      isLoading = false;
    }
  })
  $: degreeModules = $userDegrees.map((degree) => {return degree.enrolledModules});
  // can be undefined
  $: degrees = $userDegrees.map((degree) => {return degree.degree?.name});
</script>

{#if isLoading}
<Tabs.Root value="0" class="w-4/5 h-4/5">
  <Tabs.List class="grid w-full">
    <Skeleton class="flex-grow"/>
  </Tabs.List>
  <Tabs.Content value="0">
    <ModuleManagerTable />
  </Tabs.Content>
</Tabs.Root>
{:else} 
<Tabs.Root value="0" class="w-4/5">
  <Tabs.List class="flex-grow">
  {#each degrees as degree,count}
    {#if degree}
      <Tabs.Trigger value={count.toString()}>{degree}</Tabs.Trigger>
    {:else}
      <Tabs.Trigger value={count.toString()}><Skeleton class="flex-grow w-max-4/5"/></Tabs.Trigger>
    {/if}
  {/each}
  </Tabs.List>
  {#each degreeModules as modules, count}
    <Tabs.Content value={count.toString()}>
      Make changes to your account here.
    </Tabs.Content>
  {/each}
</Tabs.Root>
{/if}