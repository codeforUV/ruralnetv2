<script>
  // Using this Svelte store we can check what route we're currently on and dynamically
  // adjust the footer navbar to hide the current page link
  import { page } from "$app/stores";
</script>

<header class="fixed top-0 w-full bg-blue-600 text-white py-4">
  <ul class="flex justify-around">
    <li>RuralNet</li>
    {#if $page.url.pathname !== "/about"}
      <li><a href="about">About</a></li>
    {/if}
    {#if $page.url.pathname !== "/results"}
      <li><a href="results">Results Map</a></li>
    {/if}
    <a
      href="results"
      class="bg-gray-500 hover:bg-gray-700 text-white text-center py-2 px-4 rounded"
    >
      Test Your Speed
    </a>
  </ul>
</header>

<style>
  a {
    @apply hover:text-pink-400;
  }
</style>
