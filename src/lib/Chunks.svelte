<script lang="ts">
  import { getData, getEntries } from "../data";

  let entries = getEntries();
  let chunkMap = entries.map(([name, entries]) => {
    let chunkList: Map<{ x: number; z: number }, number> = new Map();
    for (let e of entries) {
      let { x, y, z } = e.position;
      let key = { x: Math.trunc(x / 16), z: Math.trunc(z / 16) };
      let listEntry = chunkList.get(key) ?? 0;
      listEntry += e.rate;
      chunkList.set(key, listEntry);
    }
    let sorted_chunks = Array.from(chunkList)
      .sort(([_, a], [_2, b]) => b - a)
      .map(([chunk, rate]) => {
        return { chunk, rate };
      });
    return { name, sorted_chunks };
  });
</script>

<p>Chunks</p>
