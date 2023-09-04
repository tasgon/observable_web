<script lang="ts">
	import { page } from '$app/stores';
	import type { LayoutData } from './$types';
	import { Clock, Hourglass, User } from 'lucide-svelte';

	export let data: LayoutData;

	$: basePath = `/p/${$page.params.id}`;
	$: tabs = [
		{ name: 'Individual', path: `${basePath}` },
		{ name: 'Chunks', path: `${basePath}/chunks` },
		{ name: 'Aggregate', path: `${basePath}/aggregated` },
		{ name: 'Info', path: `${basePath}/info` }
	];

	$: info = data.diagnostics;

	$: user = 'unknown';
	$: if (info.user) {
		fetch(`https://api.ashcon.app/mojang/v2/user/${info.user}`)
			.then((res) => res.json())
			.then((res) => (user = res.username));
	}
	$: duration = info?.duration ? Math.floor(info.duration / 1000.0).toString() : null;
</script>

<div class="h-screen">
	<nav class="mt-0 pl-2 flex flex-row items-end w-full bg-slate-800">
		{#each tabs as { name, path }}
			{@const focused = $page.url.pathname === path}
			<a
				href={path}
				class="p-2 mx-1 rounded-t-md {focused ? 'bg-slate-900' : 'bg-slate-700'}"
				class:hover:bg-slate-800={!focused}
			>
				{name}
			</a>
		{/each}

		<div class="flex-row ml-8 hidden sm:flex mb-2">
			<User />
			{user}
			{#if info.start}
				{@const date_str = new Date(info.start).toLocaleString()}
				<Clock class="ml-2" />
				{date_str}
			{/if}
			{#if duration}
				<Hourglass class="ml-2" />
				{duration}s
			{/if}
		</div>
	</nav>

	<div class="mx-2 pt-1">
		<slot />
	</div>
</div>

<style lang="postcss">
  :global(.tabulator) {
    @apply bg-transparent border-none !important;
  }
  :global(.tabulator-table) {
    @apply border-0 bg-slate-900 border-none !important;
  }
  :global(.tabulator-col) {
    @apply bg-slate-700 text-slate-200 border-slate-500 !important;
  }
  :global(.tabulator-row) {
    @apply text-slate-200 border-slate-500 !important;
  }
  :global(.tabulator-row-odd) {
    @apply bg-slate-800 !important;
  }
  :global(.tabulator-row-even) {
    @apply bg-slate-900 !important;
  }

  :global(.tabulator-header-filter > input) {
    @apply bg-slate-600 !important;
  }
  :global(.tabulator-header-filter > input::-webkit-search-cancel-button) {
    @apply hidden !important;
  }

  :global(.tabulator-data-tree-control) {
	@apply invert;
  }
</style>
