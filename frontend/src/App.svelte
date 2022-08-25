<script lang="ts">
  import { notif_text, setData } from "./data";

  import MainView from "./lib/MainView.svelte";
  import test_data from "./test_data.json";

  const hash = window.location.hash.substring(1);
  async function loadData() {
    setData(test_data);
    return;
    if (hash.length == 0) {
      throw new Error("profile ID cannot be empty");
    }
    const data = await fetch(`https://o.tas.sh/api/get/${hash}`);
    setData(data.json());
  }

  let promise = loadData();
</script>

<main>
  {#await promise}
    <h1 class="status">Loading {hash}...</h1>
  {:then}
    <MainView />
  {:catch error}
    <h1 class="status err">{error}</h1>
  {/await}

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
