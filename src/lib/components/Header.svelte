<!-- NAVBAR COMPONENT -->
<script>
  // Using this Svelte store we can check what route we're currently on and dynamically
  // adjust the footer navbar to hide the current page link
  import { page } from "$app/stores";
</script>

<nav class="navbar bg-base-100 flex-wrap">
  <div class="flex-1 md:hidden">
    <div class="dropdown flex-1">
      <label tabindex="0" class="btn btn-ghost btn-circle">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          ><path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 6h16M4 12h16M4 18h7"
          /></svg
        >
      </label>
      <ul
        tabindex="0"
        class="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
      >
        <a href="/" class="py-3">Home</a>
        <a href="about" class="py-3">About</a>
        <a href="results" class="py-3">Results</a>
      </ul>
    </div>
    <a href="/" class="m-1 font-bold text-xl flex-none">RuralNet</a>
  </div>

  <div class="hidden basis-full md:block md:navbar-start md:flex-1">
    <a href="/" class="m-1 font-bold text-xl">RuralNet</a>

    <a href="/" class="p-3">Home</a>
    <a href="about" class="p-3">About</a>
    <a href="results" class="p-3">Results</a>
    <a href="/" class="py-3">API Fix 1</a>
  </div>

  {#if $page.url.pathname !== "/"}
    <div class="basis-full justify-end md:basis-auto">
      <a href="/" class="btn w-full md:w-auto">Test Your Speed</a>
    </div>
  {/if}
</nav>
