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

  export let data: SuperValidated<Infer<LoginFormSchema>>;
  const form = superForm(data, {
    validators : zodClient(loginFormSchema),
  });
  const { form: loginFormData, enhance, errors} = form;
  const handleOAuth = async () => {
    console.log('oauth')
  };
</script>

<form method="POST" use:enhance>
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