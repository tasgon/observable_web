<script lang="ts">
  import { getData, notify } from "../data";
  import type { Entry } from "../types";

  let data = new Map(
    [
      ...Object.entries(getData().blocks),
      ...Object.entries(getData().entities),
    ].map(([name, entries]) => [
      name,
      (entries as Entry[]).sort((a, b) => b.rate / b.ticks - a.rate / a.ticks),
    ])
  );
  let dim_map = Array.from(data).map(([dim, entries]) => {
    return {
      dim,
      rate: entries.reduce((acc, i) => acc + i.rate / i.ticks, 0),
      enabled: false,
    };
  });

  let query = "";
  let notif_text = "";
</script>

<input bind:value={query} placeholder="Search entries..." class="search" />
<table class="tbl" style="width: 100%;">
  {#each dim_map as { dim, rate, enabled }}
    {@const entries = (data.get(dim) ?? []).filter((x) =>
      x.type.includes(query)
    )}
    <tr class="tbl">
      <td
        on:click={(_) => (enabled = !enabled)}
        style="width: 50%; font-weight: bold; cursor: pointer;"
        >{enabled ? "-" : "+"} {dim} &mdash; {entries.length} entries</td>
      <td>{rate.toFixed(2)} us/t</td>
      <td>Teleport command</td>
    </tr>
    {#if enabled}
      {#each entries as entry}
        {@const tp_text = `/o tp ${dim}`}
        <tr style="font-size: 1em;">
          <td style="padding-left: 2em;">{entry.type}</td>
          <td
            >{(entry.rate / entry.ticks).toFixed(2)} us/t ({entry.ticks} ticks)</td>
          <td style="width: 30%;">
            <i
              on:click={(_) => {
                window.navigator.clipboard.writeText(tp_text);
                notify(`Copied '${tp_text}' to clipboard`);
              }}>📋</i>
          </td>
        </tr>
      {/each}
    {/if}
  {/each}
</table>

<style>
  .tbl {
    border-bottom: 1px solid #484848;
    border-collapse: collapse;
  }

  .search {
    width: 100%;
    margin: 0.5em 0;
    border: 0;
  }
</style>
