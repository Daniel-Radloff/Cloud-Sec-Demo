import type { PageServerLoad } from './$types';
import { zod } from "sveltekit-superforms/adapters";
import { fail, superValidate } from "sveltekit-superforms";
import { registerFormSchema } from '$lib/components/ui/register-form';
import type { Actions } from '@sveltejs/kit';

export const load = (async () => {
    return {form: await superValidate(zod(registerFormSchema))};
}) satisfies PageServerLoad;


export const actions: Actions = {
  default: async (event) => {
    const form = await superValidate(event, zod(registerFormSchema));
    if (!form.valid) {
      return fail(400, {
        form,
      });
    }
    return {
      form,
    };
  },
};