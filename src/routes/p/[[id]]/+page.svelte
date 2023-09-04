<script lang="ts">
	import { copyTPCommand } from '$lib/utils';
	import type { PageData } from './$types';

	export let data: PageData;

	const WINDOW_SIZE = 100;

	let query = '';

	$: dim_map = data.entries.map(([dim, entries]) => {
		return {
			dim,
			rate: entries.reduce((acc, i) => acc + i.rate / 1000, 0),
			enabled: true,
			offset: 0,
			entries: entries.filter((i) => i.type.includes(query))
		};
	});
</script>

<div class="w-full">
	<input
		bind:value={query}
		placeholder="Search entries..."
		class="w-full mx-2 bg-slate-900 focus:outline-none"
	/>
</div>
<table class="border-b w-full">
	{#each dim_map as { dim, rate, enabled, entries, offset }}
		{@const slice = entries.slice(offset, Math.min(offset + WINDOW_SIZE, entries.length))}
		<tr class="border-b h-min">
			<td on:click={(_) => (enabled = !enabled)} class="font-bold cursor-pointer">
				<span>{enabled ? '-' : '+'} {dim}</span>
				<span>&mdash; {entries.length} entries</span>
			</td>
			<td>{Math.round(rate)} us/t</td>
			<td>Position</td>
		</tr>
		<tbody hidden={!enabled}>
			<tr class="tbtn" on:click={(_) => (offset -= WINDOW_SIZE)} hidden={offset == 0}
				><div>&minus;</div></tr
			>
			{#each slice as entry}
				{@const { x, y, z } = entry.position}
				<tr>
					<td class="pl-4">{entry.type}</td>
					<td>{Math.round(entry.rate / 1000)} us/t</td>
					<td style="width: 30%;">
						<div class="min-w-[30%] inline-block">
							({x}, {y}, {z})
						</div>

						<button
							type="button"
							class="text-blue-400"
							on:click={(_) => {
								copyTPCommand(dim, entry.entityId ?? entry.position);
							}}
						>
							Visit
						</button>
					</td>
				</tr>
			{/each}
			<tr
				class="tbtn"
				on:click={(_) => (offset += WINDOW_SIZE)}
				hidden={offset + WINDOW_SIZE > entries.length}><div>&plus;</div></tr
			>
		</tbody>
	{/each}
</table>

<style lang="postcss">
	.tbtn {
		@apply cursor-pointer text-blue-400;
	}

	.tbtn > div {
		padding-left: 3em;
		user-select: none;
	}

	tr {
		font-size: 1em;
		border-bottom: 1px solid #404040;
	}
</style>
