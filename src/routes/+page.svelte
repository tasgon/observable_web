<script lang="ts">
	import { goto } from "$app/navigation";
	import { page } from "$app/stores";
	import type { PageData } from "./$types";

    $: {
        let hash = $page.url.hash;
        if (hash) goto(`/profile/${hash.slice(1)}`);
    }
</script>

<div class="mx-32">
</div>