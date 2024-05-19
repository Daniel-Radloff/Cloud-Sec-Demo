<script lang="ts">
  import { Skeleton } from "$lib/components/ui/skeleton";
  export let service_name:string;
  export let image_url:string;
  export let href:string;
  export let loading:boolean;
</script>
{#if loading}
  <Skeleton class="size-[30vh] m-10" />
{:else}
<div class="container flex flex-col size-[30vh] text-center m-10">
  <a href={href} class="block p-4 border">
    <h2 class="text-center text-xl">{service_name}</h2>
    <img src="{image_url}" alt="{service_name}"/>
  </a>
</div>
{/if}