<script lang="ts">
  import { page } from '$app/stores';
  import type { LayoutData } from './$types';
  import Clock from 'lucide-svelte/icons/clock';
  import Download from 'lucide-svelte/icons/download';
  import Hourglass from 'lucide-svelte/icons/hourglass';
  import User from 'lucide-svelte/icons/user';

  export let data: LayoutData;

  $: basePath = $page.params.id ? `/p/${$page.params.id}` : '/p';
  $: tabs = [
    { name: 'Individual', path: `${basePath}` },
    { name: 'Chunks', path: `${basePath}/chunks` },
    { name: 'Aggregate', path: `${basePath}/aggregated` },
    { name: 'Traces', path: `${basePath}/traces`, hidden: !data.profile.traces },
    { name: 'Info', path: `${basePath}/info` }
  ];

  $: info = data.diagnostics;

  $: user = 'unknown';
  $: if (info?.user) {
    fetch(`https://api.ashcon.app/mojang/v2/user/${info.user}`)
      .then((res) => res.json() as Promise<{ username: string }>)
      .then((res) => (user = res.username ?? 'unknown'));
  }
  $: duration = info?.duration ? Math.floor(info.duration / 1000.0).toString() : null;
</script>

<div class="h-screen">
  <nav class="mt-0 pl-2 flex flex-row items-end w-full bg-neutral-800">
    {#each tabs as { name, path, hidden }}
      {@const focused = $page.url.pathname === path}
      <a
        href={path}
        class="p-2 mx-1 rounded-t-md {focused
          ? 'bg-neutral-900'
          : 'bg-neutral-700'} transition ease-in-out duration-100"
        class:hover:bg-neutral-800={!focused}
        class:hidden
      >
        {name}
      </a>
    {/each}

    <div class="flex-row ml-8 hidden sm:flex mb-2">
      <User />
      {user}
      {#if info?.start}
        {@const date_str = new Date(info.start).toLocaleString()}
        <Clock class="ml-2" />
        {date_str}
      {/if}
      {#if duration}
        <Hourglass class="ml-2" />
        {duration}s
      {/if}
    </div>

    {#if $page.params.id}
      <div class="flex-row ml-auto mr-2 hidden sm:flex">
        <a
          href="/v1/get/{$page.params.id}"
          download="{$page.params.id}.json"
          class="p-2 mx-1 rounded-md bg-neutral-700 transition ease-in-out duration-100 hover:bg-neutral-800"
        >
          <Download />
        </a>
      </div>
    {/if}
  </nav>

  <div class="mx-2 pt-1">
    <slot />
  </div>
</div>
