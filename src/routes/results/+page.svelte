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

<div class="flex justify-center">
  <div
    class="w-full lg:w-1/2 lg:hover:transition-width lg:hover:w-full duration-300"
  >
    <div class="p-4 w-full h-[75vh] lg:w-full" id="mapContainer">
      <ApiMap {data} />
    </div>
  </div>
</div>
