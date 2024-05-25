<script lang="ts">
  import type { UserRegisteredModule } from "@cos720project/shared";
  import * as Table from "$lib/components/ui/table";
  import { Button } from "$lib/components/ui/button/index";

  export let data: UserRegisteredModule[] = [];
  export let callback:(moduleId:string) => void;

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
          <Button variant="destructive" on:click={() => {callback(module.moduleId)}}>Deregister</Button>
        {:else}
          <Button variant="default" disabled>Registration Ended</Button>
        {/if}
      </Table.Cell>
    </Table.Row>
    {/each}
  </Table.Body>
</Table.Root>