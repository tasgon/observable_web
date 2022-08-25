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

  let showInfo = false;
</script>

<main style="">
  <nav class="navbar">
    {#each tabs as { name, comp }}
      <button
        on:click={(e) => (activeTab = comp)}
        class={"button " + (activeTab === comp ? "active" : "")}>{name}</button>
    {/each}

    <button
      on:click={(_) => (showInfo = !showInfo)}
      style="float: right; margin-right: 0.25em;">Info</button>
  </nav>

  <div style="display: flex">
    {#each tabs as { name, comp }}
      {@const visible = activeTab === comp}
      <div hidden={!visible} style="margin: 0 0.5em; width: 100%;">
        <svelte:component this={comp} />
      </div>
    {/each}

    <div hidden={showInfo === false} class="info" />
  </div>
</main>

<style>
  .active {
    text-shadow: -0.03ex 0 currentColor, 0.06ex 0 currentColor;
  }
  .navbar {
    width: 100vw;
    background-color: rgba(100, 100, 100, 0.5);
    border-bottom: 1px gray;
    padding-top: 0.1em;
    margin-bottom: 0.5em;
  }

  .button {
    border-radius: 0.5em 0.5em 0 0;
    margin: 0 0.1rem;
  }

  .info {
    width: 30vw;
    height: 100vw;
  }
</style>
