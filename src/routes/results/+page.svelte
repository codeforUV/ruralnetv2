<!-- We don't need an endpoint here is just load the data from the API server-side -->
<script>
  import ApiMap from "$lib/components/APIMap.svelte";

  export let data = [];
</script>

<svelte:head>
  <title>Results</title>
</svelte:head>

<div class="container mx-auto p-8 prose">
  <h1 class="text-4xl mb-6">Test Results</h1>
</div>
<div class="card w-96 bg-base-100 shadow-xl">
  <div class="card-body">
    <h2 class="card-title">Map Legend</h2>
    <p>
      <span class="btn btn-circle btn-small no-animation">.</span> less than 25
      mbps
      <span>i</span>
    </p>
    <p><span>dot</span> 25 mbps to 100 mbps <span>i</span></p>
    <p><span>dot</span> greater than 100 mbps <span>i</span></p>
  </div>
</div>

<div class="flex justify-center">
  <div
    class="w-full lg:w-1/2 lg:hover:transition-width lg:hover:w-full duration-300"
  >
    <div class="p-4 w-full h-[75vh] lg:w-full " id="mapContainer">
      <ApiMap {data} />
    </div>
  </div>
</div>
