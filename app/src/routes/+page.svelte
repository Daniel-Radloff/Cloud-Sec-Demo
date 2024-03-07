<script lang="ts">
	import type { PageData } from "./$types";
  import LoginForm from "./login-form.svelte";
  export let data: PageData;
</script>
<h1>Welcome to UP Module Manager</h1>
<LoginForm data={data.form} />
