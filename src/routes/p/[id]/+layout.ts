import type { DataWithDiagnostics, Profile } from "../../../lib/types";

export const ssr = false;

const getEntries = (profile: Profile) => {
  if (!profile) return [];
  let result = new Map(Object.entries(profile.entities));
  let global_ticks = profile.ticks;
  for (let [name, entries] of Object.entries(profile.blocks)) {
    let combined = [...(result.get(name) ?? []), ...entries];
    for (let e of combined) {
      e.rate *= e.ticks / global_ticks;
    }
    result.set(name, combined);
  }
  let ret = Array.from(result);
  return ret;
};

export async function load({ params, fetch }) {
  const res = await fetch(`/v1/get/${params.id}`);
  let { data: profile, diagnostics }: DataWithDiagnostics = await res.json();
  return {
    profile,
    diagnostics,
    entries: getEntries(profile)
  };
} 