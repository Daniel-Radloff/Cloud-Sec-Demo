
<script lang="ts">
  import type { UniversityModule } from "@cos720project/shared";
  import {createRender, createTable,Render, Subscribe}  from "svelte-headless-table";
  import { readable, type Readable } from "svelte/store";
  import * as Table from "$lib/components/ui/table";
	import { DeleteIcon } from "lucide-svelte";
  import { Button } from "$lib/components/ui/button/index";

  export let data: UniversityModule[] = [];
  export let callback:(id:string) => void;

</script>

<Table.Root>
  <Table.Header>
    <Table.Row>
      <Table.Head>Code</Table.Head>
      <Table.Head>Name</Table.Head>
      <Table.Head>Credits</Table.Head>
      <Table.Head>Remove</Table.Head>
    </Table.Row>
  </Table.Header>
  <Table.Body>
    {#each data as module}
    <Table.Row>
      <Table.Cell>{module.code}</Table.Cell>
      <Table.Cell>{module.name}</Table.Cell>
      <Table.Cell>{module.credits}</Table.Cell>
      <Table.Cell>
        <Button variant="destructive" on:click={() => {callback(module.id ? module.id : "")}}>Remove</Button>
      </Table.Cell>
    </Table.Row>
    {/each}
  </Table.Body>
</Table.Root>