import type { PageServerLoad } from './$types';
import { zod } from "sveltekit-superforms/adapters";
import { loginFormSchema } from "$lib/components/ui/login-form/schema";
import { superValidate } from "sveltekit-superforms";

export const load = (async () => {
    return {form: await superValidate(zod(loginFormSchema))};
}) satisfies PageServerLoad;