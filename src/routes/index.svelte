<script>
  import SpeedTest from "$lib/components/SpeedTest.svelte";
</script>

<svelte:head>
  <title>Home</title>
</svelte:head>
<!-- license information for main image is here: https://commons.wikimedia.org/wiki/File:Vermont_fall_foliage_hogback_mountain.JPG 
license requires including a link to the license and attribution -->
<div
  class="bg-[url(/images/vt_trees_mtns.jpg)] bg-cover bg-no-repeat bg-center min-h-screen
flex"
>
  <div class="m-auto w-1/2">
    <SpeedTest />
  </div>
</div>
