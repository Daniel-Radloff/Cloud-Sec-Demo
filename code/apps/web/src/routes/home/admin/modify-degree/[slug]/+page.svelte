<script lang="ts">
  import * as Form from "$lib/components/ui/form";
  import { Input } from "$lib/components/ui/input";
  import { Collections, universityDegree, universityModule, type UniversityDegree, type UniversityModule } from "@cos720project/shared";
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
  import { getFirebaseFirestoreClient, getFirebaseFunctionsClient } from "$lib/firebase/firebase.app";
  import { httpsCallable } from "firebase/functions";
  import { functionNames } from "$lib/app-constants";
  import { stripObject } from "$lib/functions";
  import { derived, writable, type Writable } from "svelte/store";
  import { page } from "$app/stores";
  import { collection, doc, getDoc, getDocs } from "firebase/firestore";
  import { goto } from "$app/navigation";
	import AdminModuleTable from "$lib/components/ui/admin-module-table/admin-module-table.svelte";
  import { Switch } from "$lib/components/ui/switch";
 
  export let data: PageData;
  type Dictionary = {[key:string]: UniversityModule[]};
  // store data
  let degree:Writable<UniversityDegree> = writable(data.form.data);
  let modules:Writable<UniversityModule[][]> = writable([]);
  // popup ui variables
  let degreeLenths = [3,4,5,6,7]
  let durationPopup = false;
  let coreModulePopup = false;
  let electiveModulePopup = false;


  onMount(async () => {
    const db = getFirebaseFirestoreClient();
    const degreeRef = doc(db,Collections.degrees,$page.url.pathname.split('/').at(-1)!)
    const degreeSnap = await getDoc(degreeRef);
    if (!degreeSnap.exists()) {
      console.error("requested document does not exist!")
      goto("/home/admin");
      return
    }
    let validatedDegree = universityDegree.parse(degreeSnap.data());
    const coreModuleSnapshots = await Promise.all(
      validatedDegree.coreModules.map(
        async (id) => await getDoc(doc(db,Collections.modules,id))
    ));
    const coreModules = coreModuleSnapshots.map((snap) => universityModule.parse(snap.data()));
    const electiveModuleSnapshots = await Promise.all(
      validatedDegree.electiveModules.map(
        async (id) => await getDoc(doc(db,Collections.modules,id))
    ));
    const electiveModules = electiveModuleSnapshots.map((snap) => universityModule.parse(snap.data()));
    validatedDegree.coreModuleObjects = coreModules;
    validatedDegree.electiveModuleObjects = electiveModules;
    degree.set(validatedDegree);
    degree.subscribe((value) => {
      $formData = value;
    })

    const moduleSnapshots = await getDocs(collection(db,Collections.modules));
    let groupedModules:Dictionary = {};
    moduleSnapshots.docs.forEach((doc)=>{
      const validatedModule = universityModule.parse(doc.data());
      if (!groupedModules[validatedDegree.department]) groupedModules[validatedModule.department] = []
      groupedModules[validatedModule.department].push(validatedModule);
    });
    modules.set(Object.entries(groupedModules).map(([_,value]) => value));
  })

  const form = superForm(data.form, {
    validators: zodClient(universityDegree),
    resetForm : false,
    onResult({result}) {
      if (result.type != "success") return;
      const functions = getFirebaseFunctionsClient();
    },
  });

  const { form: formData, enhance } = form;

  function closeAndFocusTrigger(triggerId: string) {
    coreModulePopup = false;
    electiveModulePopup = false;
    durationPopup = false;
    tick().then(() => {
      document.getElementById(triggerId)?.focus();
    });
  }

  // button callbacks
  const coreModuleCallback = (id:string) => {
    const updatedCoreModules = $degree.coreModules.filter(moduleId => moduleId != id);
    const updatedCoreModuleObjects = $degree.coreModuleObjects?.filter(module => module.id != id);
    degree.update((current) => {
      current!.coreModules = updatedCoreModules;
      current!.coreModuleObjects = updatedCoreModuleObjects;
      return current;
    })
  }

  const electiveModuleCallback = (id:string) => {
    const updatedElectiveModules = $degree.electiveModules.filter(moduleId => moduleId != id);
    const updatedElectiveModuleObjects = $degree.electiveModuleObjects?.filter(module => module.id != id);
    degree.update((current) => {
      current.electiveModules = updatedElectiveModules;
      current.electiveModuleObjects = updatedElectiveModuleObjects;
      return current;
    })
  }

</script>
 
<div>
<form method="post" use:enhance>
  <Form.Field {form} name="description">
    <Form.Control let:attrs>
      <Form.Label>Description</Form.Label>
      <Textarea
        {...attrs}
        placeholder="Description of the module"
        class="resize-none"
        bind:value={$degree.description}
      />
    </Form.Control>
    <Form.FieldErrors />
  </Form.Field>
  <Form.Field {form} name="duration" class="flex flex-col">
    <Popover.Root bind:open={durationPopup} let:ids>
      <Form.Control let:attrs>
        <Form.Label>Duration</Form.Label>
        <Popover.Trigger
              class={cn(
                buttonVariants({ variant: "outline" }),
                "w-[200px] justify-between",
                !$degree.duration && "text-muted-foreground"
              )}
              role="combobox"
              {...attrs}
            >
              {$degree.duration > 0 ? $degree.duration + " years" :
                "Select Course Duration"}
              <ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Popover.Trigger>
        <input hidden value={$degree.duration} name={attrs.name} />
      </Form.Control>
      <Popover.Content class="w-[200px] p-0">
        <Command.Root>
          <Command.Group>
            {#each degreeLenths as degreeDuration}
              <Command.Item
                value={degreeDuration.toString()}
                onSelect={() => {
                  $degree.duration = degreeDuration;
                  closeAndFocusTrigger(ids.trigger);
                }}
              >
                {degreeDuration.toString() + " years"}
                <Check
                  class={cn(
                    "ml-auto h-4 w-4",
                    degreeDuration !== $degree.duration && "text-transparent"
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
  <Form.Field {form} name="coreModules" class="flex flex-col">
    <Popover.Root bind:open={coreModulePopup} let:ids>
      <Form.Control let:attrs>
        <Form.Label>Core Modules</Form.Label>
        <Popover.Trigger
              class={cn(
                buttonVariants({ variant: "outline" }),
                "max-w-[400px] justify-between text-muted-foreground"
              )}
              role="combobox"
              {...attrs}
            >
              {"Add Additional Core Modules"}
              <!-- TODO replace with + sign -->
              <ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Popover.Trigger>
        <input hidden value={$degree.coreModules} name={attrs.name} />
      </Form.Control>
      <Popover.Content class="max-w-[600px] p-0">
        <Command.Root>
          <Command.Input placeholder="Type a command or search..."/>
          <Command.List class="max-h-[500px]">
          <Command.Empty>No results found.</Command.Empty>
          {#each $modules as moduleGroup}
            <Command.Group heading={moduleGroup.at(0)?.department}>
              {#each moduleGroup as module}
              <Command.Item
                value={module.id}
                onSelect={() => {
                  degree.update((currentValue) => {
                    currentValue.coreModuleObjects?.push(module);
                    // braindeath cast but the thing eslint is being weird
                    currentValue.coreModules.push(module.id ?? "");
                    return currentValue;
                  });
                  closeAndFocusTrigger(ids.trigger);
                }}
              >
                {"(" + module.code + ") " + module.name}
              </Command.Item>
              {/each}
            </Command.Group>
            {/each}
          </Command.List>
        </Command.Root>
      </Popover.Content>
    </Popover.Root>
    <AdminModuleTable data={$degree.coreModuleObjects} callback={coreModuleCallback}/>
    <Form.Description>Semster that the module is presented in</Form.Description>
    <Form.FieldErrors />
  </Form.Field>
  <Form.Field {form} name="electiveModules" class="flex flex-col">
    <Popover.Root bind:open={electiveModulePopup} let:ids>
      <Form.Control let:attrs>
        <Form.Label>Elective Modules</Form.Label>
        <Popover.Trigger
              class={cn(
                buttonVariants({ variant: "outline" }),
                "max-w-[400px] justify-between text-muted-foreground"
              )}
              role="combobox"
              {...attrs}
            >
              {"Add Additional Core Modules"}
              <!-- TODO replace with + sign -->
              <ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Popover.Trigger>
        <input hidden value={$degree.electiveModules} name={attrs.name} />
      </Form.Control>
      <Popover.Content class="max-w-[600px] p-0">
        <Command.Root>
          <Command.Input placeholder="Type a command or search..."/>
          <Command.List class="max-h-[500px]">
          <Command.Empty>No results found.</Command.Empty>
          {#each $modules as moduleGroup}
            <Command.Group heading={moduleGroup.at(0)?.department}>
              {#each moduleGroup as module}
              <Command.Item
                value={module.id}
                onSelect={() => {
                  degree.update((currentValue) => {
                    currentValue.electiveModuleObjects?.push(module);
                    // braindeath cast but the thing eslint is being weird
                    currentValue.electiveModules.push(module.id ?? "");
                    return currentValue;
                  });
                  closeAndFocusTrigger(ids.trigger);
                }}
              >
                {"(" + module.code + ") " + module.name}
              </Command.Item>
              {/each}
            </Command.Group>
            {/each}
          </Command.List>
        </Command.Root>
      </Popover.Content>
    </Popover.Root>
    <AdminModuleTable data={$degree.electiveModuleObjects} callback={coreModuleCallback}/>
    <Form.Description>Semster that the module is presented in</Form.Description>
    <Form.FieldErrors />
  </Form.Field>
  <Form.Field {form} name="minCreditsPerSemester">
    <Form.Control let:attrs>
      <Form.Label>Minimum credit requirement per semester</Form.Label>
      <Input {...attrs} bind:value={$degree.minCreditsPerSemester} type="number"/>
    </Form.Control>
    <Form.Description>Minimum amount of credits required to be taken per semester</Form.Description>
    <Form.FieldErrors />
  </Form.Field>
  <Form.Field {form} name="minCredits">
    <Form.Control let:attrs>
      <Form.Label>Degree minimum credit requirement</Form.Label>
      <Input {...attrs} bind:value={$degree.minCredits} type="number"/>
    </Form.Control>
    <Form.Description>Minimum amount of credits required to complete the degree</Form.Description>
    <Form.FieldErrors />
  </Form.Field>
  <Form.Field {form} name="discontinued">
    <Form.Control let:attrs>
      <div class="space-y-0.5">
        <Form.Label>Discontinue Degree</Form.Label>
        <Form.Description>
          Warning, this removes the ability to register for a degree.
        </Form.Description>
      </div>
      <Switch
        includeInput
        {...attrs}
        bind:checked={$degree.discontinued}
      />
    </Form.Control>
  </Form.Field>
  <Form.Button>Register New Module</Form.Button>
</form>
</div>