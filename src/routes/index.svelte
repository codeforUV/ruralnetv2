<script context="module">
  export const prerender = true;
</script>

<script>
  import SpeedTest from "$lib/components/SpeedTest.svelte";
</script>

<style>
</style>

<svelte:head>
  <title>Home</title>
</svelte:head>

<div
  class="bg-[url(/images/vt_trees_mtns.jpg)] bg-cover bg-no-repeat bg-center min-h-screen"
>
  <SpeedTest />
</div>
