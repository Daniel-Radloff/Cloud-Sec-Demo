// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
import type {DecodedIdToken} from "firebase-admin/auth"
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			firebaseAuthToken : DecodedIdToken|undefined,
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
