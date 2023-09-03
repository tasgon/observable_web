<script lang="ts">
	import { TabulatorFull as Tabulator } from 'tabulator-tables';
	import 'tabulator-tables/src/scss/tabulator.scss';
	import type { PageData } from './$types';
	import { copyTPCommand } from '$lib/utils';
	import { Loader2 } from 'lucide-svelte';
	import type { Position } from '$lib/types';

	export let data: PageData;

	$: dimensions = data.entries.map(([dim, _]) => dim);
	$: rowData = data.entries.flatMap(([dim, entries]) => {
		return entries.map((entry) => ({
			dim,
			...entry
		}));
	});

	let tableEl: HTMLDivElement | undefined;
	let loaded = false;

	$: if (tableEl) {
		const table = new Tabulator(tableEl, {
			height: '92vh',
			data: rowData,
			selectable: false,
			layout: 'fitColumns',
			columns: [
				{
					title: 'Dimension',
					field: 'dim',
					headerFilter: 'list',
					headerSort: false,
					headerFilterPlaceholder: 'Filter dimensions...',
					headerFilterParams: { values: dimensions, freetext: true, autocomplete: true }
				},
				{
					title: 'Type',
					field: 'type',
					headerFilter: true,
					headerSort: false,
					headerFilterPlaceholder: 'Search...'
				},
				{
					title: 'Position (click to copy)',
					field: 'position',
					headerSort: false,
					cellClick(_, cell) {
						const data = cell.getData() as (typeof rowData)[0];
						copyTPCommand(data.dim, data.entityId ?? data.position);
					},
					formatter(cell) {
						const { x, y, z } = cell.getValue() as Position;
						return `(${x}, ${y}, ${z})`;
					}
				},
				{
					title: 'Rate',
					field: 'rate',
					sorter: 'number',
					headerSort: false,
					formatter(cell) {
						const rate = cell.getValue() as number;
						return `${Math.round(rate / 10.0) / 100.0} us/t`;
					}
				}
			],
			initialSort: [{ column: 'rate', dir: 'desc' }]
		});
		table.on('tableBuilt', () => (loaded = true));
	}
</script>

{#if !loaded}
	<div class="w-full flex items-center justify-center">
		<div class="animate-spin h-min w-min">
			<Loader2 />
		</div>
	</div>
{/if}

<div bind:this={tableEl} class="mt-1 w-full px-2 h-[80vh]" />
