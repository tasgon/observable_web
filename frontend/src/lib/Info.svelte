<script lang="ts">
  import { all_data } from "../data";

  $: info = $all_data?.diagnostics;

  $: user = "unknown";
  $: if (info?.user) {
    fetch(`https://api.ashcon.app/mojang/v2/user/${info.user}`)
      .then((res) => res.json())
      .then((res) => (user = res.username));
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