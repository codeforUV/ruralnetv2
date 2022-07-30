<script>
  import SpeedTest from "$lib/components/SpeedTest.svelte";
</script>

<svelte:head>
  <title>Home</title>
</svelte:head>
<!-- license information for main image is here: https://commons.wikimedia.org/wiki/File:Vermont_fall_foliage_hogback_mountain.JPG 
license requires including a link to the license and attribution -->
<div class="hero min-h-screen" style="background-image: url(/images/vt_trees_mtns.jpg)">
  <div class="hero-overlay bg-opacity-10"></div>
  <div class="max-w-lg">
    <SpeedTest />
  </div>
</div>
