<script>
  // Main speed test component that makes heavy use of the RuralText class in
  // classes.js To show data from an on-going speed test or previous test results, the
  // class saves this data to a currentTest svelte store which is read by this component
  // to reactively update the UI.
  import { createEventDispatcher, onMount } from "svelte";
  import { RuralTest } from "$lib/classes.js";
  import { session } from "$app/stores";
  import { currentTest } from "$lib/stores";

  import LoadingSpinner from "./LoadingSpinner.svelte";

  // Run speed test with console logging when in development
  let logging = import.meta.env.DEV;
  const dispatch = createEventDispatcher();

  // Initialize a new instance of the class that handles speed tests
  const speedTest = new RuralTest(logging, $session.userid);

  // Create some initial values for UI
  let headerText = "Take a new test";
  let showStartButton = true;
  let showSurveyButton = false;
  let loading = false;

  // Watches the $currentTest sveltestore and auto-updates the javascript variables in
  // real-time
  $: {
    if ($currentTest.state === "not started") {
      headerText = "Take a new test";
    } else if ($currentTest.state === "finished") {
      headerText = "Complete";
      loading = false;
      showSurveyButton = true;
    }
  }

  onMount(() => {
    // Check local storage for a last test result and display it if we have one
    speedTest.checkLocalForPrevTest();
  });

  // Because it takes a few seconds for the sveltestore to get set after a new speeed
  // test starts, we immediately change the values of these JS variables so the UI
  // updates as soon as a user clicks the button.
  const startTest = async () => {
    loading = true;
    showStartButton = false;
    headerText = "In Progress";
    speedTest.startTest();
  };

  // TODO: write me
  const startSurvey = () => {
    console.log("Show survey");
  };

  // TODO: write or delete me
  const handleCancelTest = () => {
    speedTest.abortTest();
  };
</script>

<div
  class="grid grid-rows-[repeat(11,_minmax(0,_1fr))] grid-cols-3 bg-white bg-opacity-80 p-4 w-full h-96 text-center
rounded-3xl"
>
  <!-- Header text row  -->
  <div class="col-span-3 row-span-3 row-start-1">
    <h1 class="text-4xl py-4">{headerText}</h1>
  </div>

  <!-- Loading spinner, start button, or survey button row -->
  {#if loading}
    <div
      class="col-span-1 col-start-2 row-start-4 row-span-3 flex items-center justify-center"
    >
      <LoadingSpinner />
    </div>
  {/if}
  {#if showStartButton}
    <div class="col-span-3 row-start-4 row-span-3">
      <button
        class="px-8 py-4 bg-blue-500 hover:bg-blue-700 text-white rounded-full cursor-pointer text-3xl"
        on:click={startTest}>Start</button
      >
    </div>
  {/if}
  {#if showSurveyButton}
    <div class="col-span-3 row-start-4 row-span-3">
      <button
        class="px-8 py-4 bg-blue-500 text-white rounded-full cursor-pointer text-xl hover:bg-blue-700"
        on:click={startSurvey}>Take a Quick Survey!</button
      >
    </div>
  {/if}

  <!-- Metrics row -->
  {#if $currentTest.ping}
    <div class="col-span-1 flex flex-col my-auto row-start-7 row-span-3">
      <p class="text-3xl">
        {$currentTest.ping} <span class="text-2xl">ms</span>
      </p>
      <p class="text-gray-500">Ping</p>
    </div>
  {/if}
  {#if $currentTest.downloadSpeed}
    <div class="col-span-1 flex flex-col my-auto row-start-7 row-span-3">
      <p class="text-3xl">
        {$currentTest.downloadSpeed} <span class="text-2xl">mb/s</span>
      </p>
      <p class="text-gray-500">Download</p>
    </div>
  {/if}
  {#if $currentTest.uploadSpeed}
    <div class="col-span-1 flex flex-col my-auto row-start-7 row-span-3">
      <p class="text-3xl">
        {$currentTest.uploadSpeed} <span class="text-2xl">mb/s</span>
      </p>
      <p class="text-gray-500">Upload</p>
    </div>
  {/if}

  <!-- Location row -->
  {#if $currentTest.location}
    <div
      class="row-start-[10] row-span-1 h-2 col-start-2 text-center text-sm text-gray-500 underline"
    >
      <p>{$currentTest.location}</p>
    </div>
  {/if}

  <!-- Link to results map row -->
  <div
    class="row-start-[11] row-span-1 h-2 col-start-2 text-center text-sm text-blue-500 underline"
  >
    <a href="/results">Skip to Results Map →</a>
  </div>
</div>
