<script lang="ts">
  import * as Form from "$lib/components/ui/form";
  import { Input } from "$lib/components/ui/input";
  import { universityModule, type UniversityModule } from "@cos720project/shared";
  import { superForm } from "sveltekit-superforms";
  import { zod, zodClient } from "sveltekit-superforms/adapters";
  import type { PageData } from "./$types";
  import * as Popover from "$lib/components/ui/popover/index.js";
  import * as Command from "$lib/components/ui/command/index.js";
  import { cn } from "$lib/utils.js";
  import { buttonVariants } from "$lib/components/ui/button/index.js";
  import { Check, ChevronsUpDown } from "lucide-svelte";
  import { onMount, tick } from "svelte";
  import { Textarea } from "$lib/components/ui/textarea";
	import { getFirebaseFunctionsClient } from "$lib/firebase/firebase.app";
	import { httpsCallable } from "firebase/functions";
	import { functionNames } from "$lib/app-constants";
	import { stripObject } from "$lib/functions";
	import { toast } from "svelte-sonner";
 
  export let data: PageData;
  let openSemesterDialog = false;
  let openTermDialog = false;
  let semesters = [1,2];
  let terms = [undefined,1,2,3,4];
  let postingLock = false;
  const form = superForm(data.form, {
    validators: zodClient(universityModule),
    resetForm : false,
    async onResult({result}) {
      if (result.type != "success") {
        toast("You have errors in your form!");
        postingLock = false;
        return;
      }
      const functions = getFirebaseFunctionsClient();
      const addModule = httpsCallable(functions, functionNames.moduleFunctions.addModule);
      await addModule(stripObject($formData));
      toast("Module Added!")
      postingLock = false;
    },
    onSubmit() {
      postingLock = true;
    }
  });

  const { form: formData, enhance } = form;

  function closeAndFocusTrigger(triggerId: string) {
    openSemesterDialog = false;
    tick().then(() => {
      document.getElementById(triggerId)?.focus();
    });
  }
</script>
 
<div>
<form method="post" use:enhance>
  <Form.Field {form} name="name">
    <Form.Control let:attrs>
      <Form.Label>Module Name</Form.Label>
      <Input disabled={postingLock} {...attrs} bind:value={$formData.name} />
    </Form.Control>
    <Form.Description>The full name of the module</Form.Description>
    <Form.FieldErrors />
  </Form.Field>
  <Form.Field {form} name="code">
    <Form.Control let:attrs>
      <Form.Label>Module Code</Form.Label>
      <Input disabled={postingLock} {...attrs} bind:value={$formData.code} />
    </Form.Control>
    <Form.Description>Shorthand code that identifies the module. Eg. COS132</Form.Description>
    <Form.FieldErrors />
  </Form.Field>
  <Form.Field {form} name="department">
    <Form.Control let:attrs>
      <Form.Label>Department</Form.Label>
      <Input disabled={postingLock} {...attrs} bind:value={$formData.department} />
    </Form.Control>
    <Form.Description>Department in charge of management of the module</Form.Description>
    <Form.FieldErrors />
  </Form.Field>
  <Form.Field {form} name="semester" class="flex flex-col">
    <Popover.Root bind:open={openSemesterDialog} let:ids>
      <Form.Control let:attrs>
        <Form.Label>Presentation Time</Form.Label>
        <Popover.Trigger
              class={cn(
                buttonVariants({ variant: "outline" }),
                "w-[200px] justify-between",
                !$formData.semester && "text-muted-foreground"
              )}
              role="combobox"
              {...attrs}
            >
              {$formData.semester > 0 ? "Semster " + $formData.semester : "Select Semester"}
              <ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Popover.Trigger>
        <input hidden value={$formData.semester} name={attrs.name} />
      </Form.Control>
      <Popover.Content class="w-[200px] p-0">
        <Command.Root>
          <Command.Group>
            {#each semesters as semester}
              <Command.Item
                value={semester.toString()}
                onSelect={() => {
                  if (postingLock) {
                    toast("Waiting for your previous updates to apply")
                    return;
                  }
                  $formData.semester = semester;
                  closeAndFocusTrigger(ids.trigger);
                }}
              >
                {"Semester " + semester.toString()}
                <Check
                  class={cn(
                    "ml-auto h-4 w-4",
                    semester !== $formData.semester && "text-transparent"
                  )}
                />
              </Command.Item>
            {/each}
          </Command.Group>
        </Command.Root>
      </Popover.Content>
    </Popover.Root>
    <Form.Description>Semster that the module is presented in</Form.Description>
    <Form.FieldErrors />
  </Form.Field>
  <Form.Field {form} name="term" class="flex flex-col">
    <Popover.Root bind:open={openTermDialog} let:ids>
      <Form.Control let:attrs>
        <Form.Label>Presentation Term?</Form.Label>
        <Popover.Trigger
              class={cn(
                buttonVariants({ variant: "outline" }),
                "w-[200px] justify-between",
                !$formData.term && "text-muted-foreground"
              )}
              role="combobox"
              {...attrs}
            >
              {$formData.term  ? "Term " + $formData.term : "None"}
              <ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Popover.Trigger>
        {#if $formData.term}
        <input hidden value={$formData.term} name={attrs.name} />
        {/if}
      </Form.Control>
      <Popover.Content class="w-[200px] p-0">
        <Command.Root>
          <Command.Group>
            {#each terms as term}
              <Command.Item
                value={term ? term.toString() : undefined}
                onSelect={() => {
                  if (postingLock) {
                    toast("Waiting for your previous updates to apply")
                    return;
                  }
                  $formData.term = term;
                  closeAndFocusTrigger(ids.trigger);
                }}
              >
                {term ? "Term " + term.toString() : "No term"}
                <Check
                  class={cn(
                    "ml-auto h-4 w-4",
                    term !== $formData.term && "text-transparent"
                  )}
                />
              </Command.Item>
            {/each}
          </Command.Group>
        </Command.Root>
      </Popover.Content>
    </Popover.Root>
    <Form.Description>If module is presented during a specific term, specify that here</Form.Description>
    <Form.FieldErrors />
  </Form.Field>
  <Form.Field {form} name="description">
    <Form.Control let:attrs>
      <Form.Label>Description</Form.Label>
      <Textarea
        disabled={postingLock}
        {...attrs}
        placeholder="Description of the module"
        class="resize-none"
        bind:value={$formData.description}
      />
    </Form.Control>
    <Form.FieldErrors />
  </Form.Field>
  <Form.Field {form} name="cost">
    <Form.Control let:attrs>
      <Form.Label>Cost of the module</Form.Label>
      <Input disabled={postingLock} {...attrs} bind:value={$formData.cost} type="number"/>
    </Form.Control>
    <Form.Description>How much the module costs</Form.Description>
    <Form.FieldErrors />
  </Form.Field>
  <Form.Field {form} name="credits">
    <Form.Control let:attrs>
      <Form.Label>Module total credits</Form.Label>
      <Input disabled={postingLock} {...attrs} bind:value={$formData.credits} type="number"/>
    </Form.Control>
    <Form.Description>Amount of credits that the module provides</Form.Description>
    <Form.FieldErrors />
  </Form.Field>
  <Form.Button>Register New Module</Form.Button>
</form>
</div>