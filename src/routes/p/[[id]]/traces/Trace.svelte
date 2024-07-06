<script lang="ts">
  import { type Trace } from '$lib/types';
  import { Minus, Plus } from 'lucide-svelte';
  export let data: Trace;
  export let total: number | undefined = undefined;
  export let expanded = true;
</script>

<div class="w-full">
  <button class="flex flex-row items-center w-full" on:click={() => (expanded = !expanded)}>
    <span class="text-blue-400" class:invisible={data.children.length === 0}>
      <svelte:component this={expanded ? Minus : Plus} size={16} />
    </span>
    <code class="pl-2">{data.className}:{data.methodName}</code>
    <span class="ml-auto">{((100.0 * data.count) / (total ?? data.count)).toFixed(2)}%</span>
  </button>
  {#if expanded}
    <div class="pl-4 ml-[7px]" class:border-l-2={data.children.length > 1}>
      {#each data.children as trace}
        <svelte:self
          data={trace}
          total={total ?? data.count}
          expanded={data.children.length === 1}
        />
      {/each}
    </div>
  {/if}
</div>
