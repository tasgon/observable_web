<script lang="ts">
  import { notif_text, data, getData } from "./data";
  import Home from "./lib/Home.svelte";

  import MainView from "./lib/MainView.svelte";

  let hash: string;
  let update_hash = () => (hash = window.location.hash.substring(1));

  update_hash();
</script>

<svelte:window on:hashchange={update_hash} />

<main>
  {#if hash.length == 0}
    <Home />
  {:else}
    {#await getData(hash)}
      <h1 class="status">Loading {hash}...</h1>
    {:then}
      <MainView />
    {:catch error}
      <h1 class="status err">{error}</h1>
    {/await}
  {/if}

  <div hidden={$notif_text === ""} class="notif">{@html $notif_text}</div>
</main>

<style>
  .status {
    width: 100%;
    opacity: 0.6;
    text-align: center;
  }
  .err {
    color: red;
  }

  .notif {
    position: fixed;
    right: 10vw;
    background: rgba(64, 64, 64, 0.8);
    padding: 1em;
    border-radius: 1em;
    word-wrap: break-word;
    text-align: center;
    max-width: 50vw;
    bottom: 5vh;
  }
</style>
