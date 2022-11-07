<script lang="ts">
  import Aggregate from "./Aggregate.svelte";

  import Chunks from "./Chunks.svelte";
  import Individual from "./Individual.svelte";
  import Diagnostics from "./Diagnostics.svelte";
  import Info from "./Info.svelte";
  import { all_data, entry_id } from "../data";

  const hash = window.location.hash.substring(1);
  let tabs = [
    { name: "Individual Results", comp: Individual },
    { name: "Chunks", comp: Chunks },
    { name: "Aggregate Results", comp: Aggregate },
    { name: "Info", comp: Diagnostics },
  ];

  let activeTab = tabs[0].comp;

  let download = () => {
    let a = document.createElement("a");
    a.style.display = "none";
    a.download = `${entry_id}.json`;

    let blob = new Blob([JSON.stringify($all_data)]);
    const url = window.URL.createObjectURL(blob);
    a.href = url;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
  };
</script>

<main style="">
  <nav class="navbar">
    <a href="/" style="display: flex; align-items: center;">
      <img
        src="logo.png"
        alt="Observable"
        style="height: 2em; padding: 0 0.25em;" />
    </a>

    {#each tabs as { name, comp }}
      <button
        on:click={(e) => (activeTab = comp)}
        class={"button " + (activeTab === comp ? "active" : "")}>{name}</button>
    {/each}

    <div class="info">
      <Info />
    </div>

    <button
      class="icon-cloud-download"
      style="padding: 1em;"
      on:click={download} />
  </nav>

  <div style="display: flex">
    {#each tabs as { comp }}
      {@const visible = activeTab === comp}
      <div hidden={!visible} style="margin: 0 0.5em; width: 100%;">
        <svelte:component this={comp} />
      </div>
    {/each}
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
    display: flex;
  }

  .button {
    border-radius: 0.5em 0.5em 0 0;
    margin: 0 0.1rem;
  }

  .info {
    flex-grow: 1;
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
