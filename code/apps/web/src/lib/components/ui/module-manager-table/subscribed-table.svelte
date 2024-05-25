<script lang="ts">
  import type { UserRegisteredModule,UniversityModule } from "@cos720project/shared";
  import {createRender, createTable,Render, Subscribe}  from "svelte-headless-table";
  import { readable, type Readable } from "svelte/store";
  import * as Table from "$lib/components/ui/table";
	import { DeleteIcon } from "lucide-svelte";
  import { Button } from "$lib/components/ui/button/index";

  export let data: UserRegisteredModule[] = [];
  export let callback:(index:number) => void;

</script>

<Table.Root>
  <Table.Header>
    <Table.Row>
      <Table.Head>Module Name</Table.Head>
      <Table.Head>Code</Table.Head>
      <Table.Head>Credits</Table.Head>
      <Table.Head>Status</Table.Head>
      <!-- <Table.Head>Prerequisites</Table.Head> -->
      <Table.Head>Deregister</Table.Head>
    </Table.Row>
  </Table.Header>
  <Table.Body>
    {#each data as module, index}
    <Table.Row>
      <Table.Cell>{module.module?.name}</Table.Cell>
      <Table.Cell>{module.module?.code}</Table.Cell>
      <Table.Cell>{module.module?.credits}</Table.Cell>
      <Table.Cell>{module.status}</Table.Cell>
      <Table.Cell>
        {#if module.status = "enrolled"}
          <Button variant="destructive" on:click={() => {callback(index)}}>Deregister</Button>
        {:else}
          <Button variant="default" disabled>Registration Ended</Button>
        {/if}
      </Table.Cell>
    </Table.Row>
    {/each}
  </Table.Body>
</Table.Root>