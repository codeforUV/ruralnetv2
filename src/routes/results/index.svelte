<script >
  import ApiMap from "$lib/components/APIMap.svelte";
  
  export let docs = [];
</script>

<h1 class="text-4xl pt-8 pl-8 mb-6">Test Results</h1>

<div class="p-4 w-screen h-[80vh]">
  <ApiMap data={docs}/>
</div>

