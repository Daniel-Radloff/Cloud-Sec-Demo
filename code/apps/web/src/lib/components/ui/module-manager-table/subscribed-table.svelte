<script lang="ts">
  import type { UserRegisteredModule,UniversityModule } from "@cos720project/shared";
  import {createTable,Render, Subscribe}  from "svelte-headless-table";
  import type { Readable } from "svelte/store";
  import * as Table from "$lib/components/ui/table";
	import { UndoIcon } from "lucide-svelte";

  export let data: Readable<UserRegisteredModule[]>;
  export let adminView: boolean = false;
  const table = createTable(data);

  const columns = table.createColumns([
    table.column({
      header : "Course",
      accessor : (module) => {module.module?.code}
    }),
    table.column({
      header : "Description",
      accessor : (module) => {module.module?.description}
    }),
    table.column({
      header : "Status",
      accessor : (module) => {module.status}
    }),
    table.column({
      header : "Presentation Period",
      accessor : (userModule) => {userModule.module!.term ? userModule.module?.term : userModule.module?.semester}
    }),
    table.column({
      header : "Registration Date",
      accessor : (module) => {module.registrationDate}
    })
  ])
  const { headerRows, pageRows, tableAttrs, tableBodyAttrs } =
    table.createViewModel(columns);
</script>

<Table.Root {...$tableAttrs}>
  <Table.Header>
    {#each $headerRows as headerRow}
      <Subscribe rowAttrs={headerRow.attrs()}>
        <Table.Row>
          {#each headerRow.cells as cell (cell.id)}
            <Subscribe attrs={cell.attrs()} let:attrs props={cell.props()}>
              <Table.Head {...attrs}>
                <Render of={cell.render()} />
              </Table.Head>
            </Subscribe>
          {/each}
        </Table.Row>
      </Subscribe>
    {/each}
  </Table.Header>
  <Table.Body {...$tableBodyAttrs}>
    {#each $pageRows as row (row.id)}
      <Subscribe rowAttrs={row.attrs()} let:rowAttrs>
        <Table.Row {...rowAttrs}>
          {#each row.cells as cell (cell.id)}
            <Subscribe attrs={cell.attrs()} let:attrs>
              <Table.Cell {...attrs}>
                <Render of={cell.render()} />
              </Table.Cell>
            </Subscribe>
          {/each}
        </Table.Row>
      </Subscribe>
    {/each}
  </Table.Body>
</Table.Root>