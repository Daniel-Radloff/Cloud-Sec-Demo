<script lang='ts'>
  import * as Form from '$lib/components/ui/form';
  import {Input} from '$lib/components/ui/input';
  import {Button} from '$lib/components/ui/button';
  import { zodClient } from 'sveltekit-superforms/adapters';
  import {type LoginFormSchema, loginFormSchema, StudentNumberRegex, StudentCodeRegex} from './schema';
  import {
    type SuperValidated,
    type Infer,
    superForm,
  } from 'sveltekit-superforms';
  import {GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup, type User} from "firebase/auth";
  import { getFirebaseAuthClient } from '$lib/firebase/firebase.app';
	import { toast } from 'svelte-sonner';
	import { goto } from '$app/navigation';
	import type { Writable } from 'svelte/store';

  export let data: SuperValidated<Infer<LoginFormSchema>>;
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
      const result = await signInWithEmailAndPassword(auth,email,$loginFormData.password)
      authstore.update((old) => result.user);
      goto("/home");
    } catch (error) {
      toast("We don't know about this account, try registering or using google signing with your UP account instead!");
      console.log(error);
    }
  };

  //restict to UP domains only
  const handleOAuth = async () => {
    const auth = getFirebaseAuthClient();
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth,provider);
      authstore.update((old) => result.user);
      goto("/home");
    } catch(error) {
        console.log(error);
        toast("Oops, please sign in with a UP account");
    }
  };

  const form = superForm(data, {
    dataType: 'json',
    resetForm : false,
    validators : zodClient(loginFormSchema),
    async onResult({result}) {
      if (result.type != "success") {
        toast("You have errors in your form!");
        return;
      }
      await handleUsernameOrEmail();
    },
  });
  const { form: loginFormData, enhance, errors} = form;

</script>
<div>
<form method="post" use:enhance bind:this={usernamePasswordForm}>
  <Form.Field {form} name="username">
    <Form.Control let:attrs>
      <Form.Label>Username</Form.Label>
      <Input {...attrs} bind:value={$loginFormData.username} />
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
  <Form.Button>Login</Form.Button>
  <Button on:click={() => goto("/register")}>Register Using Email</Button>
  <Button on:click={handleOAuth}>Login With Google</Button>
</form>
<form method="post" bind:this={oauthTokenForm}>
  <input name="token" type="hidden" bind:this={oauthTokenInput}/>
</form>
</div>