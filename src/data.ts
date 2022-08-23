import { getContext, setContext } from "svelte";
import { writable } from "svelte/store";
import type { Profile } from "./types";

export function setData(data: any) {
  setContext("profiling_data", data);
}

export function getData(): Profile {
  return getContext("profiling_data");
}

export const notif_text = writable("");

export function notify(msg: string) {
  notif_text.set(msg);
  console.log(msg);
  setTimeout(() => notif_text.set(""), 1000);
}
