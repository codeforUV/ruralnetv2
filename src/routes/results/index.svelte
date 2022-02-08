<!-- TODO: Replace this page with the actual results map. This was just to make sure the
databast connection was working-->
<script>
  // This is the what we get returned to us fom get() inside of routes/results/index.js
  // Setting a default value of [] in case we don't get anything back so the #each loop
  // below doesn't crash
  export let docs = [];
</script>

<div class="p-8">
  <h1 class="text-4xl mb-6">Test Results</h1>
  <ol class="list-decimal pl-6">
    {#each docs as { _id, downloadSpeed, uploadSpeed, ping, city, internetProvider, date }, i}
      <li>
        <p>
          <strong>Speed: </strong>
          {downloadSpeed}/{uploadSpeed} Mbps
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="icon icon-tabler icon-tabler-square-x"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="#607D8B"
            fill="none"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <rect x="4" y="4" width="16" height="16" rx="2" />
            <path d="M10 10l4 4m0 -4l-4 4" />
          </svg>
        </p>
        <p class="font-bold">Ping: {ping}ms</p>
        <p class="italic">
          {internetProvider}, {city || "location unknown"}, {date}
        </p>
      </li>
    {/each}
  </ol>
</div>
