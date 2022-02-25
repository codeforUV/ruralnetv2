<script>
  let publicEndpoints = [
    {
      name: "/api/v1/findUser (GET)",
      explanation:
        "Find a user in the database given an ip address and a query param and a userid cookie",
      route: "/api/v1/findUser",
    },
    {
      name: "/api/v1/searchCity (GET)",
      explanation:
        "Use the MapQuest API to find to find city, state information give latlng as a query param",
      route: "/api/v1/searchCity",
    },
    {
      name: "/api/v1/verifyLocation (GET)",
      explanation:
        "Use the MapQuest API to verify the inputted address is a valid existing street address given location as a query param",
      route: "/api/v1/verifyLocation",
    },
    {
      name: "/api/v1/saveTest (POST)",
      explanation: "Save a single test result to the db",
      route: "/api/v1/saveTest",
    },
  ];
  let privateEndpoints = [
    {
      name: "/api/v1/db (GET, POST, DELETE)",
      explanation: "Server only database CRUD endpoint",
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
  <h1 class="text-4xl font-bold mb-6">API v1</h1>
  <h2 class="text-2xl font-bold mb-6">Public Endpoints</h2>
  <ul class="list-disc">
    {#each publicEndpoints as { name, explanation, route }}
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
  <h2 class="text-2xl font-bold mb-6">Private Endpoints</h2>
  <ul class="list-disc">
    {#each privateEndpoints as { name, explanation, route }}
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
