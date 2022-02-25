<!-- We don't need an endpoint here is just load the data from the API server-side -->
<script context="module">
  export async function load({ fetch }) {
    const resp = await fetch("/api/v1/db");
    const { docs } = await resp.json();
    return {
      status: 200,
      props: { docs },
    };
  }
</script>

<script>
  import ApiMap from "$lib/components/APIMap.svelte";

  export let docs = [];
</script>

<h1 class="text-4xl pt-8 pl-8 mb-6">Test Results</h1>

<div class="p-4 w-screen h-[80vh]">
  <ApiMap data={docs} />
</div>
