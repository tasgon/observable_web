<script lang="ts">
  import type { LayoutData } from '../$types';
  import Trace from './Trace.svelte';

  export let data: LayoutData;

  $: traces = data.profile.traces;
</script>

{#if traces}
  <Trace data={traces} />
{:else}
  <div class="w-full">No traces available</div>
{/if}
