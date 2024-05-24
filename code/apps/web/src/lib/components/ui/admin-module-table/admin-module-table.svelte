
<script lang="ts">
  import type { UniversityModule } from "@cos720project/shared";
  import {createRender, createTable,Render, Subscribe}  from "svelte-headless-table";
  import type { Readable } from "svelte/store";
  import * as Table from "$lib/components/ui/table";
	import { DeleteIcon } from "lucide-svelte";
  import { Button } from "$lib/components/ui/button/index";

  export let data: Readable<UniversityModule[]>;
  export let callback:(id:string) => void;

  const table = createTable(data);
  const removeModule = (id:string) => {};
  const columns = table.createColumns([
    table.column({
      header : "Code",
      accessor : (module) => module.code
    }),
    table.column({
      header : "Name",
      accessor : (module) => module.name
    }),
    table.column({
      header : "Credits",
      accessor : (module) => module.credits
    }),
    table.column({
      header : "RemoveModule",
      accessor : (module) => module.id!,
      cell : ({ value }) => createRender(Button,{variant:"destructive"})
          .on('click',() => callback(value))
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