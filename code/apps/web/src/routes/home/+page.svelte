<script lang="ts">
    import LoginForm from '$lib/components/ui/login-form/login-form.svelte';
    import type { PageData } from './$types';
    import { UserServices } from '$lib/constants';
	import { HomeCardButton } from '$lib/components/ui/home-card-button';
    export let data: PageData;

</script>
<div class="flex flex-wrap justify-center">
    {#each UserServices as service}
    <HomeCardButton href={service.href} image_url={service.image_url} service_name={service.service_name}/>
    {/each}
</div>