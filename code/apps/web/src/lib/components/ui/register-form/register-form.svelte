<script lang='ts'>
  import * as Form from '$lib/components/ui/form';
  import {Input} from '$lib/components/ui/input';
  import {Button} from '$lib/components/ui/button';
  import { zodClient } from 'sveltekit-superforms/adapters';
  import {type RegisterFormSchema, registerFormSchema, StudentNumberRegex, StudentCodeRegex} from './schema';
  import {
    type SuperValidated,
    type Infer,
    superForm,
  } from 'sveltekit-superforms';
  import {GoogleAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, type User} from "firebase/auth";
  import { getFirebaseAuthClient } from '$lib/firebase/firebase.app';
	import { toast } from 'svelte-sonner';
	import { goto } from '$app/navigation';
	import type { Writable } from 'svelte/store';

  export let data: SuperValidated<Infer<RegisterFormSchema>>;
  export let authstore : Writable<User|undefined>;
  let oauthTokenForm: HTMLFormElement;
  let oauthTokenInput: HTMLInputElement;
  let usernamePasswordForm: HTMLFormElement;

  const defaultDomain = "@tuks.co.za";

  const handleUsernameOrEmail = async () => {
    const auth = getFirebaseAuthClient();
    let email:string;
    if (StudentCodeRegex.test($loginFormData.username)) {
      email = "u" + $loginFormData.username + defaultDomain;
    } else if (StudentNumberRegex.test($loginFormData.username)) {
      email = $loginFormData.username + defaultDomain;
    } else {
      email = $loginFormData.username
    }
    try {
      const result = await createUserWithEmailAndPassword(auth,email,$loginFormData.password)
      authstore.update((old) => result.user);
      goto("/");
    } catch (error) {
      console.log(error);
      return error;
    }
  };


  const form = superForm(data, {
    dataType: 'json',
    validators : zodClient(registerFormSchema),
    async onResult({result}) {
      if (result.type != "success") {
        toast("You have errors in your form!");
        return;
      }
      await handleUsernameOrEmail();
      goto("/");
    },
  });
  const { form: loginFormData, enhance, errors} = form;

</script>
<div>
<form method="post" use:enhance bind:this={usernamePasswordForm}>
  <Form.Field {form} name="username">
    <Form.Control let:attrs>
      <Form.Label>Email or Username</Form.Label>
      <Input {...attrs} bind:value={$loginFormData.username} />
    </Form.Control>
    <Form.Description>Student Number, or UP email</Form.Description>
    <Form.FieldErrors />
  </Form.Field>
  <Form.Field {form} name="firstname">
    <Form.Control let:attrs>
      <Form.Label>First Name</Form.Label>
      <Input {...attrs} bind:value={$loginFormData.firstname} />
    </Form.Control>
    <Form.Description>Student Number, or UP email</Form.Description>
    <Form.FieldErrors />
  </Form.Field>
  <Form.Field {form} name="lastname" >
    <Form.Control let:attrs>
      <Form.Label>Last Name</Form.Label>
      <Input {...attrs} bind:value={$loginFormData.lastname} />
    </Form.Control>
    <Form.Description>Student Number, or UP email</Form.Description>
    <Form.FieldErrors />
  </Form.Field>
  <Form.Field {form} name="password" class="pb-3">
    <Form.Control let:attrs >
      <Form.Label>Password</Form.Label>
      <Input type="password" {...attrs} bind:value={$loginFormData.password} />
    </Form.Control>
    <Form.Description>Your Password</Form.Description>
    <Form.FieldErrors />
  </Form.Field>
  <Form.Field {form} name="confirm" class="pb-3">
    <Form.Control let:attrs >
      <Form.Label>Confirm Password</Form.Label>
      <Input type="password" {...attrs} bind:value={$loginFormData.confirm} />
    </Form.Control>
    <Form.Description>Your Password</Form.Description>
    <Form.FieldErrors />
  </Form.Field>
  <Form.Button>Register</Form.Button>
</form>
</div>