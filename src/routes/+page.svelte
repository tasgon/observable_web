<script lang="ts">
	import { goto } from "$app/navigation";
	import { page } from "$app/stores";

    $: {
        let hash = $page.url.hash;
        if (hash) goto(`/profile/${hash.slice(1)}`);
    }
</script>
