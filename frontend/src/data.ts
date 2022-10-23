import { getContext, setContext } from "svelte";
import { derived, writable } from "svelte/store";
import type { DataWithDiagnostics, Position, Profile } from "./types";

const API_URL = "https://observable.tas.sh";
export const api = (path: string) => `${API_URL}${path}`;

export const data_map = new Map<string, Profile>();
export const data = writable<Profile | null>(null);

export async function getData(id: string) {
  let val = data_map.get(id);
  console.log(id);
  if (val) {
    data.set(val);
    return;
  }
  if (id == "local_file") {
    window.location.href = "#";
    return;
  }
  const api_val = await fetch(api(`/get/${id}`));
  let new_data: DataWithDiagnostics = await api_val.json();
  let profile = new_data.data;
  data_map.set(id, profile);
  data.set(profile);
}

export const entries = derived(data, ($data) => {
  if ($data === null) return [];
  let result = new Map(Object.entries($data.entities));
  let global_ticks = $data.ticks;
  for (let [name, entries] of Object.entries($data.blocks)) {
    let combined = [...(result.get(name) ?? []), ...entries];
    for (let e of combined) {
      e.rate *= e.ticks / global_ticks;
    }
    result.set(name, combined);
  }
  let ret = Array.from(result);
  return ret;
});

export const notif_text = writable("");

export function notify(msg: string, dur: number = 2000) {
  notif_text.set(msg);
  console.log(msg);
  setTimeout(() => notif_text.set(""), dur);
}

export function get_tp_command(
  dimension: string,
  entry: number | Position
): string {
  let cmd = `/observable tp \"${dimension}\" `;
  if (typeof entry === "number") {
    cmd += `entity ${entry}`;
  } else {
    let { x, y, z } = entry;
    cmd += `position ${x} ${y} ${z}`;
  }
  return cmd;
}
