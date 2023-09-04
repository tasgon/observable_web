<script lang="ts">
	import { TabulatorFull as Tabulator } from 'tabulator-tables';
	import 'tabulator-tables/src/scss/tabulator.scss';
	import type { PageData } from './$types';
	import { copyTPCommand } from '$lib/utils';
	import { Loader2 } from 'lucide-svelte';
	import type { Entry, Position } from '$lib/types';

	export let data: PageData;

	$: rowData = data.entries.map(([dim, entries]) => {
		return {
			type: dim,
			rate: entries.reduce((acc, i) => i.rate + acc, 0.0),
      header: true,
			_children: entries,
		}
	});

	let tableEl: HTMLDivElement | undefined;
	let loaded = false;

	$: if (tableEl) {
		const table = new Tabulator(tableEl, {
			height: '92vh',
			data: rowData,
			selectable: false,
			layout: 'fitColumns',
			dataTree: true,
      dataTreeStartExpanded: true,
			columns: [
				{
					title: 'Name',
					field: 'type',
					headerFilter: true,
					headerSort: false,
          headerFilterFunc(headerValue: string, rowValue: string, rowdata: Entry | (typeof rowData)[0]) {
            if ('header' in rowdata) return true;
            return rowValue.includes(headerValue);
          },
					headerFilterPlaceholder: 'Search...'
				},
				{
					title: 'Position (click to copy)',
					field: 'position',
					headerSort: false,
					cellClick(_, cell) {
						const parent = cell.getRow().getTreeParent();
						if (!parent) return;
						const dim = parent.getData().type;
						const data = cell.getData() as (typeof rowData)[0]["_children"][0];
						copyTPCommand(dim, data.entityId ?? data.position);
					},
					formatter(cell) {
            const v = cell.getValue() as Position | undefined;
						if (!v) return '';
						const { x, y, z } = v;
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
		table.on('tableBuilt', () => {
      loaded = true;
    });
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
