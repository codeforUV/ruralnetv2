<!-- NAVBAR COMPONENT -->
<script>
  // Using this Svelte store we can check what route we're currently on and dynamically
  // adjust the footer navbar to hide the current page link
  import { page } from "$app/stores";
</script>

<nav class="flex items-center justify-between flex-wrap  p-6">
  <div class="flex items-center flex-shrink-0  mr-6">
    <span href="/" class="font-bold text-xl">RuralNet</span>
  </div>

  <div class="w-full block flex-grow sm:flex sm:items-center sm:w-auto">
    <div class="text-sm sm:flex-grow">
      {#if $page.url.pathname !== "/"}
        <a
          href="/"
          class="block mt-4 sm:inline-block sm:mt-0  mr-4"
        >
          Home
        </a>
      {/if}
      {#if $page.url.pathname !== "/about"}
        <a
          href="about"
          class="block mt-4 sm:inline-block sm:mt-0 mr-4"
        >
          About
        </a>
      {/if}
    </div>
    <div>
      <a
        href="/"
        class="btn"
        >Test Your Speed</a
      >
    </div>
  </div>
</nav>
