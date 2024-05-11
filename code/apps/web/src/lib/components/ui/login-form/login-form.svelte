<script lang='ts'>
  import * as Form from '$lib/components/ui/form';
  import {Input} from '$lib/components/ui/input';
  import {Button} from '$lib/components/ui/button';
	import { zodClient } from 'sveltekit-superforms/adapters';
  import {type LoginFormSchema, loginFormSchema} from './schema';
  import {
    type SuperValidated,
    type Infer,
    superForm,
  } from 'sveltekit-superforms';
  import {GoogleAuthProvider, signInWithPopup} from "firebase/auth";
	import { getFirebaseAuthClient } from '$lib/firebase/firebase.app';
	import { goto } from '$app/navigation';

  export let data: SuperValidated<Infer<LoginFormSchema>>;
  let tokenForm: HTMLFormElement;
  let tokenInput: HTMLInputElement;

  const handleUsernameOrEmail = async () => {

  };

  //restict to UP domains only
  const handleOAuth = async () => {
    const auth = getFirebaseAuthClient();
    await signInWithPopup(auth,new GoogleAuthProvider)
      .then(async (result) => {
        const token = await result.user.getIdToken();
        tokenInput.value = token;
        tokenForm.submit();
      })
      .catch((error) => {
        console.log(error);
        return error;
      })
  };

  const form = superForm(data, {
    validators : zodClient(loginFormSchema),
  });
  const { form: loginFormData, enhance, errors} = form;

</script>
<div>
<form on:submit={handleUsernameOrEmail}>
  <Form.Field {form} name="username">
    <Form.Control let:attrs>
      <Form.Label>Username</Form.Label>
      <Input {...attrs} bind:value={$loginFormData.username} />
    </Form.Control>
    <Form.Description>User Number Only: u12345678</Form.Description>
    <Form.FieldErrors />
  </Form.Field>
  <Form.Field {form} name="password" class="pb-3">
    <Form.Control let:attrs >
      <Form.Label>Password</Form.Label>
      <Input {...attrs} bind:value={$loginFormData.password} />
    </Form.Control>
    <Form.Description>Your Password</Form.Description>
  </Form.Field>
  <Form.Button>Login</Form.Button>
  <Button on:click={handleOAuth}>Login With Google</Button>
</form>
<form method="post" bind:this={tokenForm}>
  <input name="token" type="hidden" bind:this={tokenInput}/>
</form>
</div>