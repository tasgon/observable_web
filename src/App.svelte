<script lang="ts">
  import Chunks from './lib/Chunks.svelte';
  import Individual from './lib/Individual.svelte';

  const hash = window.location.hash.substring(1);
  let tabs = [
    {name: "Individual Results", comp: Individual},
    {name: "Chunks", comp: Chunks}
  ]
  let activeTab = tabs[0].comp;
</script>

<main>
  <nav class="navbar">
    {#each tabs as { name, comp }}
      <button on:click={e => activeTab = comp} class={activeTab === comp ? "active" : ""}>{name}</button>
    {/each}
  </nav>

  <svelte:component this={activeTab} />
</main>

<style>
  .active {
    text-shadow: -0.03ex 0 currentColor, 0.06ex 0 currentColor;
  }
  .navbar {
    width: 100vw;
    border-bottom: 1px gray;
  }
</style>
