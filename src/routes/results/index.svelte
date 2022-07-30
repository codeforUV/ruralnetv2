<!-- We don't need an endpoint here is just load the data from the API server-side -->
<script context="module">
  // Make an authenticated request to the /api/db route and just send the sanitized data
  // back the client, rather than giving the client direct read access to the entire db
  export async function load({ fetch }) {
    const resp = await fetch("/api/v1/db");
    const { docs } = await resp.json();
    // Only send the info we need to generate the map to the client rather than
    // ip_address and potentially other identifiable info
    const data = [];
    docs.forEach(
      ({ latitude, longitude, downloadSpeed, uploadSpeed, ping, city }) => {
        data.push({
          latitude,
          longitude,
          downloadSpeed,
          uploadSpeed,
          ping,
          city,
        });
      }
    );
    return {
      status: resp.status,
      props: { data },
    };
  }
</script>

<script>
  import ApiMap from "$lib/components/APIMap.svelte";

  export let data = [];
</script>

<div class='prose'>
<h1 class="text-4xl pt-8 pl-8 mb-6">Test Results</h1>

<div class="p-4 w-screen h-[80vh]">
  <ApiMap {data} />
</div>

</div>
