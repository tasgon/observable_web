<script lang="ts">
  import { entries, get_tp_command, notify } from "../data";
  import type { Entry, Position } from "../types";

  $: data = new Map(
    $entries.map(([name, entries]) => [
      name,
      entries.sort((a, b) => b.rate - a.rate),
    ])
  );
  $: dim_map = Array.from(data).map(([dim, ent]) => {
    return {
      dim,
      rate: ent.reduce((acc, i) => acc + i.rate / 1000, 0),
      enabled: true,
    };
  });

  let query = "";
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
      <td>{Math.round(rate)} us/t</td>
      <td>Position</td>
    </tr>
    {#if enabled}
      {#each entries as entry}
        {@const tp_text = get_tp_command(dim, entry.entityId ?? entry.position)}
        {@const { x, y, z } = entry.position}
        <tr style="font-size: 1em; border-bottom: 1px solid #404040;">
          <td style="padding-left: 2em;">{entry.type}</td>
          <td>{Math.round(entry.rate / 1000)} us/t</td>
          <td style="width: 30%;">
            <div style="min-width: 30%; display: inline-block;">
              ({x}, {y}, {z})
            </div>

            <div
              style="cursor: pointer; color: lightblue; display: inline-block;"
              on:click={(_) => {
                window.navigator.clipboard.writeText(tp_text);
                notify(`Copied <code>${tp_text}</code> to clipboard`);
              }}>
              Visit
            </div>
          </td>
        </tr>
      {/each}
    {/if}
  {/each}
</table>

<style>
  .search {
    width: 100%;
    margin: 0.5em 0;
    border: 0;
  }
</style>
