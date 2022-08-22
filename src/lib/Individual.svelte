<script lang="ts">
  import { each } from "svelte/internal";
  import { getData } from "../data";
  import type { Entry } from "../types";

  import Counter from "./Counter.svelte";

  let data = new Map(
    [
      ...Object.entries(getData().blocks),
      ...Object.entries(getData().entities),
    ].map(([name, entries]) => [name, (entries as Entry[]).sort((a, b) => b.rate - a.rate)])
  );
  let dim_map = Array.from(data).map(([dim, entries]) => {
    return {
      dim,
      rate: entries.reduce((acc, i) => acc + i.rate / i.ticks, 0),
      enabled: true,
    };
  });
</script>

<table style="width: 100%;">
  {#each dim_map as { dim, rate, enabled }}
    <tr>
        <td on:click={_ => (enabled = !enabled)} style="width: 70%; font-weight: bold; cursor: pointer;">{enabled ? "⯆" : "⯈"} {dim}</td>
        <td>{rate} us/t</td>
    </tr>
    {#if enabled}
      {#each [...(data.get(dim) ?? [])] as entry}
        <tr>
            <td style="padding-left: 2em;">{entry.type}</td>
            <td>{entry.rate / entry.ticks} us/t</td>
        </tr>
      {/each}
    {/if}
  {/each}
</table>
