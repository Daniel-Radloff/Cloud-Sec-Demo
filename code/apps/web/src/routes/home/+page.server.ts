import type { PageServerLoad } from "../$types";

// Despite the load function is empty, it is required in order to trigger hooks.server.ts always there is a client side navigation to a protected route
export const load = (async () => {
  return {};
}) satisfies PageServerLoad;