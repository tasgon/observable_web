<script lang="ts">
	import '../app.css';
	import { notification } from '$lib/stores';

	$: if ($notification) {
		setTimeout(() => ($notification = ''), 2000);
	}
</script>

<slot />

{#if $notification}
	<div class="fixed right-10 bottom-10 bg-gray-700/50 w-96 p-2 rounded-lg backdrop-blur-md">
		{@html $notification}
	</div>
{/if}
