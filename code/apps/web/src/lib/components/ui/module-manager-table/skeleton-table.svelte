<script lang="ts">
  import type { UserRegisteredModule,UniversityModule } from "@cos720project/shared";
  import {createRender, createTable,Render, Subscribe}  from "svelte-headless-table";
  import { readable, type Readable } from "svelte/store";
  import * as Table from "$lib/components/ui/table";
  import { UndoIcon } from "lucide-svelte";
  import Skeleton from "../skeleton/skeleton.svelte";

  export let adminView: boolean = false;
  // all this is horrible but neciary
  let data = Array(13);
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
    {#each data as randomValue}
      <Table.Row >
        <Table.Cell class="p-0">
          <Skeleton class="w-full h-8"></Skeleton>
        </Table.Cell>
        <Table.Cell class="p-0">
          <Skeleton class="w-full h-8"></Skeleton>
        </Table.Cell>
        <Table.Cell class="p-0">
          <Skeleton class="w-full h-8"></Skeleton>
        </Table.Cell>
        <Table.Cell class="p-0">
          <Skeleton class="w-full h-8"></Skeleton>
        </Table.Cell>
        <Table.Cell class="p-0">
          <Skeleton class="w-full h-8"></Skeleton>
        </Table.Cell>
      </Table.Row>
    {/each}
  </Table.Body>
</Table.Root>