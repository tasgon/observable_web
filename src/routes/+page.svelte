<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { localData, notification } from '$lib/stores';
  import logo from '../assets/logo.png';

  $: {
    let hash = $page.url.hash;
    if (hash) goto(`/profile/${hash.slice(1)}`);
  }

  let files: FileList | null = null;

  $: if (files && files?.length > 0) {
    const file = files[0];
    file.arrayBuffer().then((data) => {
      try {
        let string_data = new TextDecoder().decode(data);
        $localData = JSON.parse(string_data);
        goto('/p');
      } catch (e) {
        $notification = `Couldn't open ${file.name}: ${e}`;
      }
    });
  }
</script>

<div class="w-full flex flex-col items-center">
  <div class="bg-neutral-800 w-full flex flex-col items-center pt-4 pb-1">
    <img src={logo} alt="Observable logo" class="rounded-lg max-w-[10rem]" />
    <p class="mt-1 text-6xl">Observable</p>
    <p>a thing by <a href="https://tas.sh">tas</a></p>
  </div>
  <div class="max-w-xl pt-1 gap-3 [&>*]:my-2">
    <p>
      Observable profiles (tile) entities and shows you what's taking up tick time and where. Forge
      and Fabric compatible. Get it on
      <a href="https://www.curseforge.com/minecraft/mc-mods/observable">CurseForge</a>,
      <a href="https://modrinth.com/mod/observable">Modrinth</a>, or
      <a href="https://github.com/tasgon/observable/releases">GitHub</a>.
    </p>
    <p>
      To get started, bind the "Show profiler screen" key to whatever you prefer, or use
      <code>/observable</code>.
    </p>
    <p>
      For more details, go
      <a href="https://github.com/tasgon/observable/wiki">here</a> for an incomplete wiki or ask me
      on
      <a href="https://discord.gg/sfPbb3b5tF">Discord</a> for help.
    </p>

    <form>
      <p>
        Have a local profile you want to analyze? Open it
        <label for="file-upload" style="cursor: pointer; color: #646cff;">here</label>.
      </p>
      <input type="file" id="file-upload" style="display: none;" bind:files accept=".json" />
    </form>
  </div>
</div>

<style lang="postcss">
  a {
    @apply text-blue-400;
  }
</style>
