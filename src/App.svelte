<script lang="ts">
  import { setData } from "./data";

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
</style>
