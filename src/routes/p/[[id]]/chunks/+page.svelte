<script lang="ts">
  import { notification } from '$lib/stores';
  import { copyTPCommand } from '$lib/utils';
  import type { PageData } from '../$types';

  export let data: PageData;

  $: chunkMap = data.entries
    .map(({ name, entries, rate }) => {
      let chunkList: Map<
        string,
        {
          chunk: { x: number; z: number };
          rate: number;
        }
      > = new Map()
      for (let entry of entries) {
        let { x, z } = entry.position;
        let chunk = { x: Math.trunc(x / 16), z: Math.trunc(z / 16) };
        let key = `x${chunk.x}z${chunk.z}`;
        let listEntry = chunkList.get(key) ?? {
          chunk,
          rate: 0
        };
        listEntry.rate += entry.rate;
        chunkList.set(key, listEntry);
      }
      let chunks = Array.from(chunkList)
        .sort(([_, a], [_2, b]) => b.rate - a.rate)
        .map(([_, entry]) => {
          return entry;
        });
      return { name, chunks, rate, enabled: true };
    });
</script>

<table class="border-b w-full">
  {#each chunkMap as { name, chunks, rate, enabled }}
    <tr class="tbl">
      <td
        on:click={(_) => (enabled = !enabled)}
        style="width: 50%; font-weight: bold; cursor: pointer;"
        >{enabled ? '-' : '+'} {name} &mdash; {chunks.length} chunks</td
      >
      <td>{Math.round(rate / 1000)} us/t</td>
      <td>Position</td>
    </tr>
    {#if enabled}
      {#each chunks as entry}
        {@const { x, z } = entry.chunk}
        {@const position = {
          x: x * 16,
          y: 128,
          z: z * 16
        }}
        <tr style="font-size: 1em; border-bottom: 1px solid #404040;">
          <td style="padding-left: 2em;">({x}, {z})</td>
          <td>{Math.round(entry.rate / 1000)} us/t</td>
          <td style="width: 30%;">
            <button
              style="cursor: pointer; color: lightblue; display: inline-block;"
              on:click={(_) => copyTPCommand(name, position)}
            >
              Visit
            </button>
          </td>
        </tr>
      {/each}
    {/if}
  {/each}
</table>
