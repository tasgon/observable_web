<script lang="ts">
  import { copyTPCommand } from '$lib/utils';
  import type { PageData } from './$types';

  export let data: PageData;

  const WINDOW_SIZE = 100;

  let query = '';

  $: dim_map = data.entries.map(({ name: dim, entries, rate }) => {
    return {
      dim,
      rate,
      enabled: true,
      offset: 0,
      entries: entries.filter((i) => i.type.includes(query))
    };
  });
</script>

<div class="w-full">
  <input
    bind:value={query}
    placeholder="Search entries..."
    class="w-full mx-2 bg-neutral-900 focus:outline-none"
  />
</div>
<table class="border-b w-full">
  {#each dim_map as { dim, rate, enabled, entries, offset }}
    {@const slice = entries.slice(offset, Math.min(offset + WINDOW_SIZE, entries.length))}
    <tr class="border-b h-min [&>*]:font-bold">
      <td on:click={(_) => (enabled = !enabled)} class="cursor-pointer">
        <span>{enabled ? '-' : '+'} {dim}</span>
        <span>&mdash; {entries.length} entries</span>
      </td>
      <td>{Math.round(rate / 1000)} us/t</td>
      <td>Position</td>
    </tr>
    <tbody hidden={!enabled}>
      <tr
        class="cursor-pointer text-blue-400"
        on:click={(_) => (offset -= WINDOW_SIZE)}
        hidden={offset == 0}>
        <span class="pl-4 select-none">&minus;</span>
      </tr>
      {#each slice as entry}
        {@const { x, y, z } = entry.position}
        <tr class="border-b border-b-neutral-600">
          <td class="pl-4">{entry.type}</td>
          <td>{Math.round(entry.rate / 1000)} us/t</td>
          <td class="w-[30%]">
            <div class="min-w-[30%] inline-block">
              ({x}, {y}, {z})
            </div>

            <button
              type="button"
              class="text-blue-400"
              on:click={(_) => {
                copyTPCommand(dim, entry.entityId ?? entry.position);
              }}
            >
              Visit
            </button>
          </td>
        </tr>
      {/each}
      <tr
        class="cursor-pointer text-blue-400"
        on:click={(_) => (offset += WINDOW_SIZE)}
        hidden={offset + WINDOW_SIZE > entries.length}
      >
        <span class="pl-4 select-none">&plus;</span>
      </tr>
    </tbody>
  {/each}
</table>
