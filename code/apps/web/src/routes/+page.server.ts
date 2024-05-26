import type { PageServerLoad } from './$types';
import { zod } from "sveltekit-superforms/adapters";
import { loginFormSchema } from "$lib/components/ui/login-form/schema";
import { superValidate } from "sveltekit-superforms";
import { getFirebaseAdminAuth } from '$lib/firebase/firebase.server';
import { redirect } from '@sveltejs/kit';

export const load = (async () => {
    return {form: await superValidate(zod(loginFormSchema))};
}) satisfies PageServerLoad;

export const actions = {
    default: async ({request, cookies}) => {
        const token = (await request.formData()).get("token");
        if (!token || typeof token !== "string") {
            throw redirect(303, "/")
        }
        //       ms x sec x min
        const ttl = 1000*60*20;
        let sessionCookie:string;
        try {
            sessionCookie = await getFirebaseAdminAuth()
                .createSessionCookie(token, {expiresIn:ttl});
            console.log("this must be in the logs else its bad");
        } catch (error) {
            console.error(error);
            throw redirect(303, "/");
        }
        cookies.set("session", sessionCookie, {
            secure:true,
            path: "/",
            sameSite:"none",
            httpOnly : true
        })
        throw redirect(303,"/")
    }
}