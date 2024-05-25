<script lang="ts">
  import type { PageData } from './$types';
  import {ModuleManagerTable} from '$lib/components/ui/module-manager-table';
	import { userAuthInfo, userDegrees } from '../../../stores';
	import { onMount } from 'svelte';
	import { awaitStore, loadDegreeStore, stripObject } from '$lib/functions';
  import * as Tabs from "$lib/components/ui/tabs";
  import { Skeleton } from "$lib/components/ui/skeleton";
	import Button from '$lib/components/ui/button/button.svelte';
  import * as Command from "$lib/components/ui/command/index.js";
	import { Collections, universityModule, type UniversityModule, type UserRegisteredDegree, type UserRegisteredModule } from '@cos720project/shared';
	import { getFirebaseFirestoreClient, getFirebaseFunctionsClient } from '$lib/firebase/firebase.app';
	import { collection, doc, getDoc } from 'firebase/firestore';
  import {writable, type Readable, type Writable} from "svelte/store";
	import { httpsCallable } from 'firebase/functions';
	import { functionNames } from '$lib/app-constants';
	import { toast } from 'svelte-sonner';
  import {derived} from 'svelte/store';
  
  //export let data: PageData;
  let isLoading = true;
  let degreeIndex = 0;

  // ui Variabels
  let registerDialog = false;
  let timer:NodeJS.Timeout;
  // data 
  let moduleSelectionFlag = false;
  const moduleSelection:Writable<UniversityModule[][]> = writable([]);
  userDegrees.subscribe(() => {
    if (moduleSelectionFlag) return;
    clearTimeout(timer);
    console.log("update in sub")
    timer = setTimeout(async () => {
      moduleSelection.set(await Promise.all($userDegrees.map((_,index) => loadOfferedModules(index))));
      moduleSelectionFlag = true;
    }, 2000);
  });
  // can be undefined
  const loadOfferedModules = async (degreeIndex:number) => {
    const selectedDegree = $userDegrees.at(degreeIndex);
    const db = getFirebaseFirestoreClient();
    const fetchFunction = async (moduleId:string) => {
      const moduleReference = await getDoc(doc(collection(db, Collections.modules),moduleId));
      return universityModule.parse(moduleReference.data());
    };
    const coreModules = await Promise.all(selectedDegree!.degree!.coreModules.map(fetchFunction));
    const electiveModules = await Promise.all(selectedDegree!.degree!.electiveModules.map(fetchFunction));
    return [coreModules,electiveModules].flat()
  }
  const degregister = (index:number) =>{};
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

  const registerModule = async (module:UniversityModule) => {
    const functions = getFirebaseFunctionsClient();
    const registerModule = httpsCallable(functions, functionNames.userDegreeFunctions.registerModule);
    const newModule:UserRegisteredModule = {
      moduleId : module.id!,
      registrationDate : new Date(),
      status : "enrolled",
      deregisterable : true,
      module :module
    }
    userDegrees.update((current) => {
      current.at(degreeIndex)!.enrolledModules.push(newModule);
      return current;
    });
    await registerModule(stripObject($userDegrees.at(degreeIndex)!));
    toast("Module Registered!");
  }
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
<Tabs.Root value="0" class="w-4/5 h-4/5">
  <Tabs.List class="grid w-full">
  {#each $userDegrees as degree,count}
    {#if degree.degree}
      <Tabs.Trigger on:click={() => degreeIndex = count} value={count.toString()}>{degree.degree?.name}</Tabs.Trigger>
    {:else}
      <Tabs.Trigger value={count.toString()}><Skeleton class="flex-grow w-max-4/5"/></Tabs.Trigger>
    {/if}
  {/each}
  </Tabs.List>
  {#each $userDegrees as degree, count }
    <Tabs.Content value={count.toString()}>
      <ModuleManagerTable data={degree.enrolledModules} callback={degregister}/>
    </Tabs.Content>
  {/each}
</Tabs.Root>
{/if}
<Button disabled={isLoading || !moduleSelectionFlag} on:click={() => registerDialog = !registerDialog}>Register for more modules</Button>

<Command.Dialog bind:open={registerDialog}>
  <Command.Input placeholder="Type a command or search..." />
  <Command.List>
    <Command.Empty>No results found.</Command.Empty>
    <Command.Group heading="Suggestions">
      {#each $moduleSelection[degreeIndex] as module}
        <Command.Item
        onSelect={() => {registerModule(module)}}
        >
          {"(" + module.code + ") " + module.name + " | " + module.credits.toString() + " Credits"}
        </Command.Item>
      {/each}
    </Command.Group>
  </Command.List>
</Command.Dialog>