<script lang="ts">
  import { all_data } from "../data";

  $: info = $all_data?.diagnostics;

  let user = "unknown";
  $: if (info?.user) {
    fetch(`https://minecraft-api.com/api/pseudo/${info.user}`)
      .then((res) => res.text())
      .then((res) => (user = res));
  }
  $: duration = info?.duration
    ? Math.floor(info.duration / 1000.0).toString()
    : null;
</script>

<div>
  <div class="icon-user" />{user}
  {#if info?.start}
    {@const date_str = new Date(info.start).toLocaleString()}
    <div class="icon-clock" />{date_str}
  {/if}
  {#if duration}
    <div class="icon-hour-glass" />{duration}s
  {/if}
</div>