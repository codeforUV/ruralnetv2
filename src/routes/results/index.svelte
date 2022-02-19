<script>
  import ApiMap from "$lib/components/APIMap.svelte";

  export let docs = [];
</script>

<div class="w-screen h-screen">
  <h1 class="text-4xl mb-6">Test Results</h1>
  <div class="w-full h-4/5 p-5">
    <ApiMap data={docs} />
  </div>
</div>
