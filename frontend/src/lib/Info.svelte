<script lang="ts">
  import { all_data, entries } from "../data";

  $: info = Object.entries($all_data?.diagnostics ?? {}).map(([key, val]) => {
    return {
      key,
      val,
      isList: typeof val === "object",
      open: true,
      str() {
        if (this.isList) {
          return this.open ? "-" : "+";
        }
        return val.toString();
      },
      entries() {
        if (this.isList && this.open) {
          return val;
        }
        return [];
      }
    };
  });
</script>

<table style="overflow: scroll">
  {#each info as i}
    <tr on:click={(_) => i.open = !i.open}>{i.key}: {i.str()}</tr>
    {#each i.entries() as j}
      <tr><div style="padding-left: 1em">{j}</div></tr>
    {/each}
  {/each}
</table>
