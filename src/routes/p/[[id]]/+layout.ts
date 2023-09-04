import { localData } from '$lib/stores';
import { get } from 'svelte/store';
import type { DataWithDiagnostics, Profile } from '../../../lib/types';
import { error } from '@sveltejs/kit';

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
    combined.sort((a, b) => b.rate - a.rate);
    result.set(name, combined);
  }
  let ret = Array.from(result);
  return ret;
};

export async function load({ params, fetch }) {
  let data: DataWithDiagnostics;
  if (!params.id) {
    const local = get(localData);
    if (!local) throw error(404, 'No data');
    data = local;
  } else {
    const res = await fetch(`/v1/get/${params.id}`);
    data = await res.json();
  }
  let { data: profile, diagnostics } = data;
  return {
    profile,
    diagnostics,
    entries: getEntries(profile)
  };
}
