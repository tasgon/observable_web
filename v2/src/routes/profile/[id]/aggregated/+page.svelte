<script lang="ts">
	import type { Entry, Profile } from "$lib/types";
	import type { PageData } from "./$types";


    export let data: PageData;
  
    function getAggregateData(profile: Profile) {
      let entries = [
        ...(Object.values(profile.blocks).flat() as Entry[]),
        ...(Object.values(profile.entities).flat() as Entry[]),
      ];
      let aggregateMap: Map<string, { rate: number; ticks: number }> = new Map();
      for (const e of entries) {
        let val = aggregateMap.get(e.type) ?? { rate: 0, ticks: 0 };
        val.rate += e.rate;
        val.ticks += e.ticks;
        aggregateMap.set(e.type, val);
      }
      return Array.from(aggregateMap.entries()).sort(([_1, a], [_2, b]) => {
        return b.rate - a.rate;
      });
    }

    $: aggregates = getAggregateData(data.profile);
  </script>
  
  <table style="width: 100%;">
    {#each aggregates as [name, { rate, ticks }]}
      <tr style="font-size: 1em;">
        <td style="padding-left: 2em;">{name}</td>
        <td>{Math.round(rate / 1000)} us/t ({ticks} ticks)</td>
      </tr>
    {/each}
  </table>
  