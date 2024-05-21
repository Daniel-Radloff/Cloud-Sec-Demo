import type { UserMetadata, UserRegisteredDegree } from "@cos720project/shared";
import {writable } from "svelte/store";
import type { User } from "firebase/auth";

export const userMetadata = writable<UserMetadata|undefined>();
export const userDegrees = writable<UserRegisteredDegree[]>([]);
export const userAuthInfo = writable<User|undefined>();