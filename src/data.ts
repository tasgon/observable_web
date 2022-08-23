import { getContext, setContext } from "svelte";
import { writable } from "svelte/store";
import type { Profile } from "./types";

export function setData(data: any) {
  setContext("profiling_data", data);
}

export function getData(): Profile {
  return getContext("profiling_data");
}

export const getEntries = () => {
  let result = new Map(Object.entries(getData().entities));
  let global_ticks = getData().ticks;
  for (let [name, entries] of Object.entries(getData().blocks)) {
    let combined = [...(result.get(name) ?? []), ...entries];
    for (let e of combined) {
      e.rate *= e.ticks / global_ticks;
    }
    result.set(name, combined);
  }
  let ret = Array.from(result);
  return ret;
};

export const notif_text = writable("");

export function notify(msg: string) {
  notif_text.set(msg);
  console.log(msg);
  setTimeout(() => notif_text.set(""), 1000);
}
