<script>
  // Using this Svelte store we can check what route we're currently on and dynamically
  // adjust the footer navbar to hide the current page link
  import { page } from "$app/stores";
</script>

<style>
  a {
    @apply hover:text-blue-400;
  }
</style>

<footer class="fixed bottom-0 w-full bg-gray-600 text-white py-4">
  <ul class="flex justify-around">
    {#if $page.url.pathname !== "/"}
      <li><a href="/">RuralNet</a></li>
    {/if}
    {#if $page.url.pathname !== "/about"}
      <li><a href="about">About</a></li>
    {/if}
    {#if $page.url.pathname !== "/results"}
      <li><a href="results">Results Map</a></li>
    {/if}
    <li><a href="https://codeforuv.org/">Code for Upper Valley</a></li>
    <li><a href="https://www.codeforamerica.org/">Code for America</a></li>
    {#if $page.url.pathname !== "/privacy"}
      <li><a href="privacy">Privacy policy</a></li>
    {/if}
  </ul>
</footer>
