<script lang="ts">
  import * as Breadcrumb from "$lib/components/ui/breadcrumb/index.js";
  import {page} from '$app/stores';
	import { UserServices, paths } from "$lib/app-constants";

  type Crumb = {
    label : string,
    href : string
  };

  let crumbs: Crumb[] = [];
  $: {
    const urls:string[] = $page.url.pathname.split('/')
      .filter((url) => url !== '');
    let tokenPath: string = "";

    crumbs = urls.map((url) => {
      tokenPath = "/" + url;
      return {
        label : url.replace(/\w+/g, (match) => match.charAt(0).toUpperCase() + match.slice(1))
          .split('-')
          .join(' '),
        href : tokenPath
      };
    })
  }

</script>

<header class="sticky top-0 z-50 w-full bg-background border-b">
<div class="container flex h-14 max-w-screen-2xl items-center">
  <div class="flex">
    <Breadcrumb.Root>
      <Breadcrumb.List>
        {#each crumbs as crumb, index}
         {#if index == crumbs.length -1}
          <Breadcrumb.Item>
            <Breadcrumb.Page>{crumb.label}</Breadcrumb.Page>
          </Breadcrumb.Item>
         {:else}
          <Breadcrumb.Item>
            <Breadcrumb.Link href={crumb.href}>{crumb.label}</Breadcrumb.Link>
          </Breadcrumb.Item>
          <Breadcrumb.Separator/>
         {/if}
        {/each}
      </Breadcrumb.List>
    </Breadcrumb.Root>
  </div>
  <div class="flex flex-1 justify-between space-x-2 md:justify-end">
    <nav class="flex items-center gap-6">
      <a href={paths.module_manager.name} >Some Link</a>
      <a href=link >Some Link</a>
      <a href=link >Some Link</a>
      <a href=link >Some Link</a>
    </nav>
  </div>
</div>
</header>
<slot/>