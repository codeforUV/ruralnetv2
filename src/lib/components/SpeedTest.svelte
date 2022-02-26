<script>
  import { createEventDispatcher, onMount } from "svelte";
  import { RuralTest } from "$lib/classes.js";
  import { session } from "$app/stores";
  import { currentTest } from "$lib/stores";

  import LoadingSpinner from "./LoadingSpinner.svelte";

  // Run speed test with console logging when in development
  let logging = import.meta.env.DEV;
  let loading = false;

  const dispatch = createEventDispatcher();
  const speedTest = new RuralTest(logging, $session.userid);

  let headerText = "";
  let showStartButton = true;

  $: {
    if ($currentTest.state === "not started") {
      headerText = "Take a new test";
    } else if ($currentTest.state === "finished") {
      headerText = "Complete";
      loading = false;
    }
  }

  onMount(() => {
    // Check local storage for a last test result and display it if we have one
    speedTest.checkLocalForPrevTest();
  });

  const startTest = async () => {
    loading = true;
    showStartButton = false;
    headerText = "In Progress";
    speedTest.startTest();
  };

  const handleCancelTest = () => {
    speedTest.abortTest();
  };
</script>

<style>
  .speed-metrics-row {
    @apply flex flex-wrap justify-center mb-2 mx-4;
  }

  .speed-metric {
    @apply my-2 mx-8;
  }

  .metric-value {
    @apply text-black text-3xl;
  }

  .location {
    color: #666;
    font-size: 12pt;
    margin-bottom: 2em;
  }
</style>

<!-- TODO Fix this flex container so it doesn't change height and width depending on the
content-->
<div
  class="text-center bg-white bg-opacity-60 flex flex-col px-32 py-16 rounded items-center"
>
  <h1 class="text-4xl mb-4">{headerText}</h1>
  <div>
    {#if showStartButton}
      <button
        class="px-4 py-2 bg-blue-500 text-white rounded cursor-pointer"
        on:click={startTest}>Start</button
      >
    {/if}
    {#if loading}
      <LoadingSpinner />
    {/if}
  </div>

  <div class="mt-4">
    {#if $currentTest.isPrevTest}
      <p>Last Speed Test Results:</p>
    {/if}
    <div class="speed-metrics-row">
      {#if $currentTest.ping}
        <div class="speed-metric">
          <div class="metric-value">
            {$currentTest.ping}ms
          </div>
          <div>Ping</div>
        </div>
      {/if}
      {#if $currentTest.downloadSpeed}
        <div class="speed-metric">
          <div class="metric-value">
            {$currentTest.downloadSpeed}
          </div>
          <div>Download</div>
        </div>
      {/if}
      {#if $currentTest.uploadSpeed}
        <div class="speed-metric">
          <div class="metric-value">
            {$currentTest.uploadSpeed}
          </div>
          <div>Upload</div>
        </div>
      {/if}
    </div>
  </div>
</div>
<!-- <div>
  <p class="location">{location}</p>
  {#if !initialLoadOfScreen}
        <LocationUpdate bind:testResult={results}/>
    {/if}
</div> -->
