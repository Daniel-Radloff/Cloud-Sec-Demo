<script lang="ts">
	import type { PageData } from "./$types";
  import RegisterForm from "$lib/components/ui/register-form/register-form.svelte";
	import { userAuthInfo } from "../../stores";
  export let data: PageData;
</script>
<section class="flex h-screen w-screen place-content-center place-items-center">
  <div class="absolute left-0 h-[100%] w-[30%]">
    <div class="absolute border-fuchsia-600 bg-fuchsia-600 w-36 h-[50%]"/>
    <div class="absolute border-fuchsia-500 bg-fuchsia-500 -skew-x-3 w-36 h-[100%]"/>
    <div class="absolute border-fuchsia-400 bg-fuchsia-400 -skew-x-6 w-28 h-[100%] left-20"/>
    <div class="absolute border-fuchsia-300 bg-fuchsia-300 -skew-x-12 w-28 h-[100%] left-32"/>
  </div>
  <div class="absolute right-0 h-[100%] w-[30%]">
    <div class="absolute border-fuchsia-600 bg-fuchsia-600 w-36 h-[50%] right-0 bottom-0"/>
    <div class="absolute border-fuchsia-500 bg-fuchsia-500 -skew-x-3 w-36 h-[100%] right-0"/>
    <div class="absolute border-fuchsia-400 bg-fuchsia-400 -skew-x-6 w-28 h-[100%] right-20"/>
    <div class="absolute border-fuchsia-300 bg-fuchsia-300 -skew-x-12 w-28 h-[100%] right-32"/>
  </div>
  <div class="flex flex-col max-w-[40%] backdrop-blur-sm p-4 rounded-md">
  <h1 class="text-2xl">Welcome to UP Module Manager</h1>
  <span class="text-2xl text-center">Please Enter your details</span>
  <RegisterForm data={data.form} authstore={userAuthInfo}/>
  </div>
</section>
