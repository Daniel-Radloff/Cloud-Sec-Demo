<script lang="ts">
  import { goto } from "$app/navigation";
	import { page } from "$app/stores";
import { Item } from "$lib/components/ui/breadcrumb";
import * as Command from "$lib/components/ui/command";
	import { getFirebaseFirestoreClient } from "$lib/firebase/firebase.app";
	import { Collections, universityDegree, type UniversityDegree } from "@cos720project/shared";
	import { collection, getDocs, or, query, where } from "firebase/firestore";
	import { onMount } from "svelte";
	import { writable } from "svelte/store";

  let timer:NodeJS.Timeout;
  let searchWord = writable("");
  // grouped by faculty
  type Dictionary = {[key:string]: UniversityDegree[]};
  let degrees:UniversityDegree[][] = [];
  let selectedDegree = "";

  const queryFirebase = async () => {
    const db = getFirebaseFirestoreClient()
    const degreesCollection = collection(db,Collections.degrees);
    // get all degrees
    const searchDegreesSnapshot = await getDocs(degreesCollection);
    let groupedDocuments:Dictionary = {};
    searchDegreesSnapshot.forEach((degree) => {
      if (!degree.exists()) return
      const typedDegree = degree.data() as UniversityDegree;
      if (!groupedDocuments[typedDegree.department]) groupedDocuments[typedDegree.department] = []
      groupedDocuments[typedDegree.department].push(typedDegree);
    });
    degrees = Object.entries(groupedDocuments).map(([_,value]) => value);
  };

  onMount(() => {queryFirebase()});
</script>
 
<Command.Root>
  <Command.Input placeholder="Type a command or search..." bind:value={$searchWord} />
  <Command.List class="max-h-[500px]">
    <Command.Empty>No results found.</Command.Empty>
    {#each degrees as group}
      <Command.Group heading={group.at(0)?.department}>
        {#each group as degree}
          <Command.Item
            value={degree.code + degree.name}
            onSelect={() => {
              goto($page.url.pathname + "/" + degree.id);
            }}
          >
            {"(" + degree.code + ") " + degree.name}
          </Command.Item>
        {/each}
      </Command.Group>
    {/each}
  </Command.List>
</Command.Root>

