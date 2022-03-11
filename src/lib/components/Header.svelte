<!-- NAVBAR COMPONENT -->
<script>
  // Using this Svelte store we can check what route we're currently on and dynamically
  // adjust the footer navbar to hide the current page link
  import { page } from "$app/stores";
</script>

<nav class="flex items-center justify-between flex-wrap bg-gray-800 p-6">
  <div class="flex items-center flex-shrink-0 text-white mr-6">
    <span href="/" class="font-bold text-xl">RuralNet</span>
  </div>

  <div class="w-full block flex-grow sm:flex sm:items-center sm:w-auto">
    <div class="text-sm sm:flex-grow">
      {#if $page.url.pathname !== "/"}
        <a
          href="/"
          class="block mt-4 sm:inline-block sm:mt-0 text-teal-200 hover:text-white mr-4"
        >
          Home
        </a>
      {/if}
      {#if $page.url.pathname !== "/about"}
        <a
          href="about"
          class="block mt-4 sm:inline-block sm:mt-0 text-teal-200 hover:text-white mr-4"
        >
          About
        </a>
      {/if}
      {#if $page.url.pathname !== "/news"}
        <a
          href="news"
          class="block mt-4 sm:inline-block sm:mt-0 text-teal-200 hover:text-white"
        >
          News
        </a>
      {/if}
    </div>
    <div>
      <a
        href="#"
        class="inline-block text-sm px-4 py-2 leading-none border rounded text-white border-white hover:border-transparent hover:text-blue-500 hover:bg-white mt-4 md:mt-0"
        >Test Your Speed</a
      >
    </div>
  </div>
</nav>
