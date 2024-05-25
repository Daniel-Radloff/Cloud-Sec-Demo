<script lang="ts">
  import * as Breadcrumb from "$lib/components/ui/breadcrumb/index.js";
  import {page} from '$app/stores';
	import { UserServices, paths } from "$lib/app-constants";
	import Button from "$lib/components/ui/button/button.svelte";
	import { getFirebaseAuthClient } from "$lib/firebase/firebase.app";
	import { goto } from "$app/navigation";

  type Crumb = {
    label : string,
    href : string
  };

  let crumbs: Crumb[] = [];
  let serviceUrls:string[] = [];
  let serviceNames:string[] = [];
  $: {
    const pageInfo = Object.entries(paths)
      .map(([path, pathdata]) => ({...pathdata,}))
      .filter(service => service.name.test($page.url.pathname))
      .at(0);
    // serviceUrls
    if (pageInfo) {
      const services = pageInfo.nav_services;
      serviceNames = services.map((service) => {
        return service.slice(1)
          .split("-")
          .filter((word) => word !== '')
          .map((word) => word.replace(/\w+/g, (match) => match.charAt(0).toUpperCase() + match.slice(1)))
          .join(' ');
      })
      serviceUrls = services.map((service) => $page.url.pathname + service)
    }

    const urls:string[] = $page.url.pathname.split('/')
      .filter((url) => url !== '');
    let tokenPath: string = "";

    const initialCrumbs = urls.map((url) => {
      tokenPath = tokenPath + "/" + url;
      return {
        label : url.replace(/\w+/g, (match) => match.charAt(0).toUpperCase() + match.slice(1))
          .split('-')
          .join(' '),
        href : tokenPath
      };
    });
    $page.route.id?.includes("[slug]") ? 
      crumbs = initialCrumbs.slice(0,-1) : 
      crumbs = initialCrumbs;
  }
  const logout = () => {
    const auth = getFirebaseAuthClient();
    auth.signOut();
    setTimeout(() => {
      goto("/");
    },300)
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
      {#each serviceUrls as _, count}
      <a href={serviceUrls[count]}>{serviceNames[count]}</a>
      {/each}
      <Button variant="ghost" on:click={logout}>Logout</Button>
    </nav>
  </div>
</div>
</header>
<slot/>