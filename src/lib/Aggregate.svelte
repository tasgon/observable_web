<script lang="ts">
  import { getData } from "../data";
  import type { Entry } from "../types";

  let entries = [
    ...(Object.values(getData().blocks).flat() as Entry[]),
    ...(Object.values(getData().entities).flat() as Entry[]),
  ];
  let aggregateMap: Map<string, { rate: number; ticks: number }> = new Map();
  for (const e of entries) {
    let val = aggregateMap.get(e.type) ?? { rate: 0, ticks: 0 };
    val.rate += e.rate;
    val.ticks += e.ticks;
    aggregateMap.set(e.type, val);
  }
  let aggregates = Array.from(aggregateMap.entries()).sort(
    ([_1, a], [_2, b]) => {
      return b.rate / b.ticks - a.rate / a.ticks;
    }
  );
</script>

<table style="width: 100%;">
  {#each aggregates as [name, { rate, ticks }]}
    <tr style="font-size: 1em;">
      <td style="padding-left: 2em;">{name}</td>
      <td>{(rate / ticks).toFixed(2)} us/t ({ticks} ticks)</td>
    </tr>
  {/each}
</table>
