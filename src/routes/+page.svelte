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
    <h1>What is this?</h1>
    <p>
      Observable profiles (tile) entities and shows you what's taking up tick time and where. It's available for Minecraft 1.16 - 1.21
      on (Neo)Forge and Fabric. Get it on
      <a href="https://www.curseforge.com/minecraft/mc-mods/observable">CurseForge</a>,
      <a href="https://modrinth.com/mod/observable">Modrinth</a>, or
      <a href="https://github.com/tasgon/observable/releases">GitHub</a>.
    </p>

    <h1>How do I use it?</h1>
    <div>
      <p>
        First, make sure you have permissions to run it. By default, only server operators
        can use the tool. They can allow everyone to use the tool by running:
      </p>
      <ul class="list-disc ml-6 mt-1">
        <li><code>/observable set allPlayersAllowed true</code> to allow everyone, or</li>
        <li><code>/observable allow &lt;username&gt;</code> to allow a specific user.</li>
      </ul>
    </div>
      
    <p>
      Once that's taken care of, bind the "Show profiler screen" key to whatever
      you prefer, or run <code>/observable run &lt;duration&gt;</code> if you're an operator.
    </p>

    <h1>I'm still confused!</h1>
    <p>
      I have an incomplete wiki available <a href="https://github.com/tasgon/observable/wiki">here</a>
      or you can talk to me on
      <a href="https://discord.gg/sfPbb3b5tF">Discord</a>.
    </p>

    <form>
      <label for="file-upload" class="cursor-pointer rounded-md bg-slate-800 w-full py-2 flex justify-center">
        <p class="text-blue-400 text-lg">
          Have a local profile you want to analyze? Open it here.
        </p>
      </label>
      <input type="file" id="file-upload" style="display: none;" bind:files accept=".json" />
    </form>
  </div>
</div>

<style lang="postcss">
  a {
    @apply text-blue-400;
  }

  h1 {
    @apply text-2xl font-semibold;
  }
</style>
