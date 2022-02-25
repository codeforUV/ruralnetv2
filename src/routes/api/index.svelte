<script>
  let endpoints = [
    {
      name: "/api/v1/findUser (GET)",
      explanation: "Find a user in the database",
      route: "/api/v1/findUser",
    },
    {
      name: "/api/v1/searchCity (GET)",
      explanation:
        "Given a latlong. use the MapQuest API to find city, state information",
      route: "/api/v1/searchCity",
    },
    {
      name: "/api/v1/verifyLocation (GET)",
      explanation:
        "Verify the inputted address is a valid existing street address",
      route: "/api/v1/verifyLocation",
    },
    {
      name: "/api/v1/db (GET, POST, DELETE)",
      explanation: "Database CRUD endpoint",
      route: "/api/v1/db",
    },
  ];
</script>

<style>
  p {
    @apply text-lg mb-4;
  }
  a {
    @apply text-blue-400 hover:text-blue-600;
  }
</style>

<svelte:head>
  <title>RuralNet API</title>
</svelte:head>

<div class="p-8">
  <h1 class="text-4xl mb-6">API v1</h1>

  <p class="mb-4">
    This is the internal API for Ruralnet and is used by the app for all
    functionality
  </p>
  <ul class="list-disc">
    {#each endpoints as { name, explanation, route }}
      <li class="list-item">
        <a rel="external" href={route}
          ><code class="block whitespace-pre overflow-x-scroll">
            {name}
          </code></a
        >
        <p class="ml-4">{explanation}</p>
      </li>
    {/each}
  </ul>
</div>
