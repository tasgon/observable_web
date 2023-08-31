<script lang="ts">
  import { data_map, notify } from "../data";
  import type { DataWithDiagnostics, Profile } from "../types";

  let files: FileList | null = null;

  function handle_file(file: File | null | undefined) {
    if (!file) return;
    file.arrayBuffer().then((data) => {
      try {
        let string_data = String.fromCharCode.apply(null, new Uint8Array(data));
        let profile: DataWithDiagnostics = JSON.parse(string_data);
        data_map.set("local_file", profile);
        window.location.href = "#local_file";
      } catch (e) {
        notify(`Couldn't open ${file.name}: ${e}`);
      }
    });
  }

  $: handle_file(files?.item(0));

  let drop_count = 0;
</script>

<div
  on:dragenter={(_) => (drop_count += 1)}
  on:dragleave={(_) => {
    drop_count -= 1;
  }}
  on:dragover={(ev) => ev.preventDefault()}
  on:drop={(ev) => {
    ev.preventDefault();
    let items = ev.dataTransfer?.items;
    if (items?.length == 0) return;
    let file = ev.dataTransfer?.items[0].getAsFile();
    handle_file(file);
    drop_count -= 1;
  }}
  class={"dropper " + (drop_count > 0 ? "on" : "")}>
  <div class="center">
    <img src="/logo.png" alt="Observable logo" class="logo" />
    <h1 style="margin-top: 1rem;">Observable</h1>
    <h3>a thing by <a href="https://tas.sh">tas</a></h3>
  </div>
  <div class="stuff">
    <!-- prettier-ignore -->
    <p>
    Observable profiles (tile) entities and shows you what's taking up tick time
    and where. Forge and Fabric compatible.
    Get it on
    <a href="https://www.curseforge.com/minecraft/mc-mods/observable">CurseForge</a>,
    <a href="https://modrinth.com/mod/observable">Modrinth</a>, or
    <a href="https://github.com/tasgon/observable/releases">GitHub</a>.
  </p>
    <p>To get started, bind the "Show profiler screen" key to whatever you prefer, or use &apos;/observable&apos.</p>
    <p>
      For more details, go
      <a href="https://github.com/tasgon/observable/wiki">here</a> for an
      incomplete wiki or ask me on
      <a href="https://discord.gg/sfPbb3b5tF">Discord</a> for help.
    </p>

    <form>
      <p>
        Have a local profile you want to analyze? Drop it anywhere on the
        screen, or just click
        <label for="file-upload" style="cursor: pointer; color: #646cff;"
          >here</label
        >.
      </p>
      <input
        type="file"
        id="file-upload"
        style="display: none;"
        bind:files
        accept=".json" />
    </form>
  </div>
</div>

<style>
  .logo {
    display: block;
    max-width: 10em;
    border-radius: 1em;
  }
  .center {
    width: 100%;
    background-color: #2f2f2f;
    padding: 1em 0;
  }

  .center > * {
    margin: 0 auto;
    text-align: center;
  }

  .stuff {
    margin: auto;
    padding: 0 1em;
    flex: 1;
    max-width: 42em;
    font-size: larger;
  }

  .dropper {
    transition: 0.3s;
    min-height: 100vh;
  }

  .on {
    opacity: 0.6;
    transition: 0.3s;
  }
</style>
