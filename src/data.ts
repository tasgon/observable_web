import { getContext, setContext } from "svelte";
import type { Profile } from "./types";

export function setData(data: any) {
  setContext("profiling_data", data);
}

export function getData(): Profile {
  return getContext("profiling_data");
}
