<script lang="ts">
  import { type Trace } from '$lib/types';
  export let data: Trace;
  export let total: number | undefined = undefined;

  let expanded = data.children.length === 1;
</script>

<div class="w-full">
  <button class="flex flex-row items-center w-full" on:click={() => (expanded = !expanded)}>
    <span class="text-blue-400 w-2" class:invisible={data.children.length === 0}>
      {expanded ? '-' : '+'}
    </span>
    <span class="pl-2">{data.className}:{data.methodName}</span>
    <span class="ml-auto">{(100.0 * data.count / (total ?? data.count)).toFixed(2)}%</span>
  </button>
  {#if expanded}
      <div class="pl-4 border-l">
        {#each data.children as trace}
          <svelte:self data={trace} total={total ?? data.count} />
        {/each}
      </div>
  {/if}
</div>
