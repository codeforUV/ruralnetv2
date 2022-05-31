<script>
  
  import CookiesWidget from "$lib/components/CookiesWidget.svelte";
  import Footer from "$lib/components/Footer.svelte";
  import Header from "$lib/components/Header.svelte";
  import "../app.css";

</script>

<Header />
<main class='h-[100vh]'>
  <slot />
</main>
<CookiesWidget/>
<Footer />

<style>
</style>
