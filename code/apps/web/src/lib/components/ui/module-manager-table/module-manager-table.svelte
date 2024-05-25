<script lang="ts">
  import type { UserRegisteredModule,UniversityModule } from "@cos720project/shared";
  import {createTable,Render, Subscribe}  from "svelte-headless-table";
  import type { Readable } from "svelte/store";
  import * as Table from "$lib/components/ui/table";
	import { UndoIcon } from "lucide-svelte";
	import SubscribedTable from "./subscribed-table.svelte";
	import SkeletonTable from "./skeleton-table.svelte";

  export let data: UserRegisteredModule[]|undefined = undefined;
  export let callback:(index:number) => void = (index:number) => {};
  export let adminView: boolean = false;
</script>

<div class="h-80vh overflow-y-auto">
  {#if data}
    <SubscribedTable data={data} callback={callback}/>
  {:else}
    <SkeletonTable adminView={adminView}/>
  {/if}
</div>