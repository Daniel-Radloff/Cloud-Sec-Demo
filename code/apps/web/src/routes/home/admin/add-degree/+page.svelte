<script lang="ts">
  import * as Form from "$lib/components/ui/form";
  import { Input } from "$lib/components/ui/input";
  import { universityDegree, type UniversityDegree } from "@cos720project/shared";
  import { superForm } from "sveltekit-superforms";
  import { zod, zodClient } from "sveltekit-superforms/adapters";
	import type { PageData } from "./$types";
  import * as Popover from "$lib/components/ui/popover/index.js";
  import * as Command from "$lib/components/ui/command/index.js";
  import { cn } from "$lib/utils.js";
  import { buttonVariants } from "$lib/components/ui/button/index.js";
	import { Check, ChevronsUpDown } from "lucide-svelte";
	import { tick } from "svelte";
	import { Textarea } from "$lib/components/ui/textarea";
	import { getFirebaseFunctionsClient } from "$lib/firebase/firebase.app";
	import { httpsCallable } from "firebase/functions";
	import { functionNames } from "$lib/app-constants";
	import { stripObject } from "$lib/functions";
	import { toast } from "svelte-sonner";
 
  export let data: PageData;
  let open = false;
  let degreeLenths = [3,4,5,6,7]
  let postingLock = false;

  const form = superForm(data.form, {
    validators: zodClient(universityDegree),
    resetForm : false,
    async onResult({result}) {
      if (result.type != "success") {
        toast("You have errors in your form!");
        postingLock = false;
        return;
      }
      const functions = getFirebaseFunctionsClient();
      const addDegree = httpsCallable(functions, functionNames.universityDegreeFunctions.addDegree);
      await addDegree(stripObject($formData));
      toast("Degree Added!")
      postingLock = false;
    },
    onSubmit() {
      postingLock = true;
    }
  });
 
  const { form: formData, enhance } = form;

  function closeAndFocusTrigger(triggerId: string) {
    open = false;
    tick().then(() => {
      document.getElementById(triggerId)?.focus();
    });
  }
</script>
 
<div>
<form method="post" use:enhance>
  <Form.Field {form} name="name">
    <Form.Control let:attrs>
      <Form.Label>Degree Name</Form.Label>
      <Input disabled={postingLock} {...attrs} bind:value={$formData.name} />
    </Form.Control>
    <Form.Description>The full name of the degree</Form.Description>
    <Form.FieldErrors />
  </Form.Field>
  <Form.Field {form} name="code">
    <Form.Control let:attrs>
      <Form.Label>Degree Code</Form.Label>
      <Input disabled={postingLock} {...attrs} bind:value={$formData.code} />
    </Form.Control>
    <Form.Description>Shorthand code that identifies the degree. Eg. BScCS</Form.Description>
    <Form.FieldErrors />
  </Form.Field>
  <Form.Field {form} name="department">
    <Form.Control let:attrs>
      <Form.Label>Department</Form.Label>
      <Input disabled={postingLock} {...attrs} bind:value={$formData.department} />
    </Form.Control>
    <Form.Description>Department in charge of management of module</Form.Description>
    <Form.FieldErrors />
  </Form.Field>
  <Form.Field {form} name="duration" class="flex flex-col">
    <Popover.Root bind:open let:ids>
      <Form.Control let:attrs>
        <Form.Label>Duration</Form.Label>
        <Popover.Trigger
              class={cn(
                buttonVariants({ variant: "outline" }),
                "w-[200px] justify-between",
                !$formData.duration && "text-muted-foreground"
              )}
              role="combobox"
              {...attrs}
            >
              {$formData.duration > 0 ? $formData.duration + " years" :
                "Select Course Duration"}
              <ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Popover.Trigger>
        <input hidden value={$formData.duration} name={attrs.name} />
      </Form.Control>
      <Popover.Content class="w-[200px] p-0">
        <Command.Root>
          <Command.Group>
            {#each degreeLenths as degreeDuration}
              <Command.Item
                value={degreeDuration.toString()}
                onSelect={() => {
                  if (postingLock) {
                    toast("Waiting for your previous updates to apply")
                    return;
                  }
                  $formData.duration = degreeDuration;
                  closeAndFocusTrigger(ids.trigger);
                }}
              >
                {degreeDuration.toString() + " years"}
                <Check
                  class={cn(
                    "ml-auto h-4 w-4",
                    degreeDuration !== $formData.duration && "text-transparent"
                  )}
                />
              </Command.Item>
            {/each}
          </Command.Group>
        </Command.Root>
      </Popover.Content>
    </Popover.Root>
    <Form.Description>Minimum duration of the degree</Form.Description>
    <Form.FieldErrors />
  </Form.Field>
  <Form.Field {form} name="description">
    <Form.Control let:attrs>
      <Form.Label>Description</Form.Label>
      <Textarea
        disabled={postingLock} 
        {...attrs}
        placeholder="Description of the degree"
        class="resize-none"
        bind:value={$formData.description}
      />
    </Form.Control>
    <Form.FieldErrors />
  </Form.Field>
  <Form.Field {form} name="minCreditsPerSemester">
    <Form.Control let:attrs>
      <Form.Label>Minimum credit requirement per semester</Form.Label>
      <Input disabled={postingLock} {...attrs} bind:value={$formData.minCreditsPerSemester} type="number"/>
    </Form.Control>
    <Form.Description>Minimum amount of credits required to be taken per semester</Form.Description>
    <Form.FieldErrors />
  </Form.Field>
  <Form.Field {form} name="minCredits">
    <Form.Control let:attrs>
      <Form.Label>Degree minimum credit requirement</Form.Label>
      <Input disabled={postingLock} {...attrs} bind:value={$formData.minCredits} type="number"/>
    </Form.Control>
    <Form.Description>Minimum amount of credits required to complete the degree</Form.Description>
    <Form.FieldErrors />
  </Form.Field>
  <Form.Button>Register New Degree</Form.Button>
</form>
</div>