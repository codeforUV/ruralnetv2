<script context="module">
  import { browser, dev } from "$app/environment";

  // we don't need any JS on this page, though we'll load
  // it in dev so that we get hot module replacement...
  export const _hydrate = dev;

  // ...but if the client-side router is already loaded
  // (i.e. we came here from elsewhere in the app), use it
  export const _router = browser;

  // since there's no dynamic data here, we can prerender
  // it so that it gets served as a static asset in prod
  export const _prerender = true;
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
  <title>About</title>
</svelte:head>

<div class="container mx-auto p-8 prose">
  <h1 class="text-4xl mb-6">About</h1>

  <p class="mb-4">
    Access to reliable high-speed internet has quickly become a requirement for
    modern life. Yet numerous communities, particularly those in more remote
    areas, still lack access and any reasonable recourse to improve their
    situation. This is because large internet-server-providers (ISPs) typically
    advertise average or best-case speeds in an area that are not representative
    of real-world accessibility by consumers. As a result, gaining traction on
    legislative efforts to improve internet infrastructure becomes difficult, as
    frustrated individuals have no reliable data that reflects this discrepancy.
    This leaves legislators with no choice but to rely on the misrepresentative
    figures provided by ISPs.
  </p>

  <p>
    The purpose of Rural Net is to provide a lightweight web application useable
    by anyone that can provide and store reliable repeated measurements of
    internet speed over multiple hours and days. Rural Net aims to make it easy
    to integrate this information with geolocation data, thereby providing a
    more accurate picture of real-world internet availability. At the same time,
    our hope is to share Rural Net and the collected internet speed data with
    any existing state or county level public service projects in this space, to
    facilitate future legislative efforts.
  </p>

  <p>Click here for the <a href="/privacy">Privacy Page</a></p>
</div>
