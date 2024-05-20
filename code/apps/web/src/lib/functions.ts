import { get, type Readable, type Writable } from "svelte/store";

export const awaitStore = async (store:Writable<unknown|undefined>|Readable<unknown|undefined>):Promise<boolean> => {
  let isLoaded = false;
  let timeout = 0;
  // +- 10 seconds which is firestore retry aswell.
  const maxRetry = 50;
  if (get(store) == undefined) {
    while (!isLoaded && timeout < maxRetry) {
      await new Promise((resolve) => setTimeout(resolve,200));
      if (get(store) != undefined) {
        isLoaded = true;
      }
      timeout = timeout + 1;
    }
    if (timeout == maxRetry) {
      console.error("lib/functions awaitStore(store): Max Retry Exceeded on listener");
      throw Error("lib/functions awaitStore(store): Max Retry Exceeded on listener");
    }
    return true;
  } else {
    return true;
  }
};