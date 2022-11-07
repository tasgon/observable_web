<script lang="ts">
  import { entries, get_tp_command, notify } from "../data";

  const WINDOW_SIZE = 100;

  let query = "";

  $: data = new Map(
    $entries.map(([name, entries]) => [
      name,
      entries
        .filter((i) => i.type.includes(query))
        .sort((a, b) => b.rate - a.rate),
    ])
  );
  $: dim_map = Array.from(data).map(([dim, entries]) => {
    return {
      dim,
      rate: entries.reduce((acc, i) => acc + i.rate / 1000, 0),
      enabled: true,
      offset: 0,
      entries,
    };
  });
</script>

<input bind:value={query} placeholder="Search entries..." class="search" />
<table class="tbl" style="width: 100%;">
  {#each dim_map as { dim, rate, enabled, entries, offset }}
    {@const slice = entries.slice(
      offset,
      Math.min(offset + WINDOW_SIZE, entries.length)
    )}
    <tr class="tbl">
      <td
        on:click={(_) => (enabled = !enabled)}
        style="width: 50%; font-weight: bold; cursor: pointer;">
        {enabled ? "-" : "+"}
        {dim} &mdash; {entries.length} entries</td>
      <td>{Math.round(rate)} us/t</td>
      <td>Position</td>
    </tr>
    <tbody hidden={!enabled}>
      <tr
        class="tbtn"
        on:click={(_) => (offset -= WINDOW_SIZE)}
        hidden={offset == 0}><div>&minus;</div></tr>
      {#each slice as entry}
        {@const tp_text = get_tp_command(dim, entry.entityId ?? entry.position)}
        {@const { x, y, z } = entry.position}
        <tr>
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
      <tr
        class="tbtn"
        on:click={(_) => (offset += WINDOW_SIZE)}
        hidden={offset + WINDOW_SIZE > entries.length}><div>&plus;</div></tr>
    </tbody>
  {/each}
</table>

<style>
  .search {
    width: 100%;
    margin: 0.5em 0;
    border: 0;
  }

  .tbtn {
    cursor: pointer;
  }

  .tbtn > div {
    padding-left: 3em;
    user-select: none;
  }

  tr {
    font-size: 1em;
    border-bottom: 1px solid #404040;
  }
</style>
