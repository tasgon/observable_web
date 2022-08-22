<script lang="ts">
  import Aggregate from "./Aggregate.svelte";

  import Chunks from "./Chunks.svelte";
  import Individual from "./Individual.svelte";

  const hash = window.location.hash.substring(1);
  let tabs = [
    { name: "Individual Results", comp: Individual },
    { name: "Chunks", comp: Chunks },
    { name: "Aggregate Results", comp: Aggregate },
  ];

  let activeTab = tabs[0].comp;
</script>

<main>
  <nav class="navbar">
    {#each tabs as { name, comp }}
      <button
        on:click={(e) => (activeTab = comp)}
        class={activeTab === comp ? "active" : ""}>{name}</button
      >
    {/each}
  </nav>

  {#each tabs as { name, comp }}
    <div hidden={activeTab !== comp}>
      <svelte:component this={comp} />
    </div>
  {/each}
</main>

<style>
  .active {
    text-shadow: -0.03ex 0 currentColor, 0.06ex 0 currentColor;
  }
  .navbar {
    width: 100vw;
    border-bottom: 1px gray;
    margin-bottom: 1em;
  }
</style>
