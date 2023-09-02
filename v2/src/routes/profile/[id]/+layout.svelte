<script lang="ts">
	import { page } from '$app/stores';
	import type { LayoutData } from './$types';
	import { Clock, Hourglass, User } from 'lucide-svelte';

	export let data: LayoutData;

	$: basePath = `/profile/${$page.params.id}`;
	$: tabs = [
		{ name: 'Individual Results', path: `${basePath}` },
		{ name: 'Chunks', path: `${basePath}/chunks` },
		{ name: 'Aggregate Results', path: `${basePath}/aggregated` },
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

<nav class="mt-0 pl-2 flex flex-row items-center w-full bg-slate-800">
	{#each tabs as { name, path }}
		<a
			href={path}
			class="bg-slate-900 p-4 mx-1 rounded-t-md"
			class:font-bold={$page.url.pathname === path}
		>
			{name}
		</a>
	{/each}

	<div class="flex flex-row ml-8">
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
