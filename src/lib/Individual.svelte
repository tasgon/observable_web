<script lang="ts">
import { each } from "svelte/internal";
import { getData } from "../data";
import type { Sample } from "../types";

import Counter from "./Counter.svelte";

let data: Map<string, Sample[]> = new Map([...Object.entries(getData().blocks)]);
</script>

{#each [...data.keys()] as i}
    <p>{i}</p>
    {#each [...data.get(i)] as j}
        <p>{j.type}</p>
    {/each}
    <!-- <p>{JSON.stringify(Object.entries(getData().blocks))}</p> -->
{/each}

<Counter />