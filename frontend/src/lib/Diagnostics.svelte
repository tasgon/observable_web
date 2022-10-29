<script lang="ts">
  import { all_data } from "../data";

  $: info = $all_data?.diagnostics;

  $: extraData = Object.entries(info?.additionalDiagnostics ?? {}).map(
    ([key, val]) => {
      return {
        key,
        val,
        open: true,
        label() {
          return `${key} ${this.open ? "-" : "+"}`;
        },
      };
    }
  );
</script>

<table style="overflow: scroll">
  {#each extraData as i}
    <tr on:click={(_) => (i.open = !i.open)} class="header">{i.label()}</tr>
    {#if i.open}
      <tr>
        <code>{i.val}</code>
      </tr>
    {/if}
  {/each}
</table>

<style scoped>
  .header {
    color: lightsteelblue;
  }

  .header:hover {
    cursor: pointer;
  }

  code {
    overflow: scroll;
    white-space: pre;
    display: block;
    padding-left: 1em;
  }

</style>