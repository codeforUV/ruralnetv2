<script>
  export let docs;
  docs = docs === undefined ? [] : docs;
  console.log(docs);
</script>

<div>
  <h2>Test Results</h2>
  <ol>
    {#each docs as { _id, downloadSpeed, city, internetProvider, date, userID }, i}
      <li>
        <p>
          <strong>Speed: </strong>
          {downloadSpeed} Mbps
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
        <p><em>{internetProvider}, {city || "location unknown"}, {date}</em></p>
        <p>{userID}</p>
      </li>
    {/each}
  </ol>
</div>
