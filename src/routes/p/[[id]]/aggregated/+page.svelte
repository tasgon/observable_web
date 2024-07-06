<script lang="ts">
  import type { Entry, Profile } from '$lib/types';
  import type { PageData } from './$types';

  export let data: PageData;

  function getAggregateData(profile: Profile) {
    let entries = [
      ...(Object.values(profile.blocks).flat() as Entry[]),
      ...(Object.values(profile.entities).flat() as Entry[])
    ];
    let aggregateMap: Map<string, { duration: number; count: number }> = new Map();
    for (const e of entries) {
      let val = aggregateMap.get(e.type) ?? { duration: 0, count: 0 };
      val.duration += e.rate * e.ticks;
      val.count++;
      aggregateMap.set(e.type, val);
    }
    return Array.from(aggregateMap.entries()).sort(([_1, a], [_2, b]) => {
      return b.duration - a.duration;
    });
  }

  $: aggregates = getAggregateData(data.profile);
  $: total = aggregates.reduce((acc, [, { duration }]) => acc + duration, 0);
</script>

<table class="w-full ml-1">
  <tr class="">
    <td>Name</td>
    <td>Time spent</td>
  </tr>
  {#each aggregates as [name, { duration, count }]}
    <tr>
      <td><span class="font-semibold">{name}</span> x{count}</td>
      <td>{Math.round(duration / 1000)} μs ({((100 * duration) / total).toFixed(1)}%)</td>
    </tr>
  {/each}
</table>
