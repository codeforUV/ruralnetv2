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

<footer class=" w-full bg-base-100 py-4">
  <div class='container px-5'>
  <ul class="flex flex-col md:flex-row md:justify-around">
    {#if $page.url.pathname !== "/"}
      <li class='p-2'><a href="/">RuralNet</a></li>
    {/if}
    {#if $page.url.pathname !== "/about"}
      <li class='p-2'><a href="about">About</a></li>
    {/if}
    {#if $page.url.pathname !== "/results"}
      <li class='p-2'><a href="results">Results Map</a></li>
    {/if}
    <li class='p-2'><a href="https://codeforuv.org/">Code for Upper Valley</a></li>
    <li class='p-2'><a href="https://www.codeforamerica.org/">Code for America</a></li>
    {#if $page.url.pathname !== "/privacy"}
      <li class='p-2'><a href="privacy">Privacy policy</a></li>
    {/if}
  </ul>
</div>
</footer>
