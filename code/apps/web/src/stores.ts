import type { UserMetadata, UserRegisteredDegree } from "@cos720project/shared";
import {writable } from "svelte/store";

export const userMetadata = writable<UserMetadata|undefined>();
export const userDegrees = writable<UserRegisteredDegree[]>();