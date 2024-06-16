import { localData } from '$lib/stores';
import { get } from 'svelte/store';
import type { DataWithDiagnostics, Entry, Profile } from '../../../lib/types';
import { error } from '@sveltejs/kit';

export const ssr = false;

const getEntries = (profile: Profile) => {
  if (!profile) return [];
  let entityMap = new Map(Object.entries(profile.entities));
  let globalTicks = profile.ticks;
  let result: {
    name: string;
    rate: number;
    entries: Entry[];
  }[] = [];
  for (let [name, entries] of Object.entries(profile.blocks)) {
    let combined = [...(entityMap.get(name) ?? []), ...entries];
    let rate = 0;
    for (let e of combined) {
      // Normalize
      e.rate *= e.ticks / globalTicks;

      rate += e.rate;
    }
    combined.sort((a, b) => b.rate - a.rate);
    result.push({
      name,
      rate,
      entries: combined
    });
  }
  return result.sort((a, b) => b.rate - a.rate);
};

export async function load({ params, fetch }) {
  let data: DataWithDiagnostics;
  if (!params.id) {
    const local = get(localData);
    if (!local) error(404, 'No data');
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
