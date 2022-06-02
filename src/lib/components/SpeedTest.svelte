<script>
  // Main speed test component that makes heavy use of the RuralText class in
  // classes.js To show data from an on-going speed test or previous test results, the
  // class saves this data to a currentTest svelte store which is read by this component
  // to reactively update the UI.
  import { createEventDispatcher, onMount } from "svelte";
  import { RuralTest } from "$lib/classes.js";
  import { session } from "$app/stores";
  import { currentTest } from "$lib/stores";

  import Survey from "./Survey.svelte";
  import LoadingSpinner from "./LoadingSpinner.svelte";
  import LocationVerify from "./LocationVerify.svelte";

  // Run speed test with console logging when in development
  let logging = import.meta.env.DEV;
  // Enable data upload by default
  let upload = true;
  const dispatch = createEventDispatcher();

  // Initialize a new instance of the class that handles speed tests
  const speedTest = new RuralTest(logging, upload, $session.userid);

  // Create some initial values for UI
  let headerText = "Take a new test";
  let showStartButton = true;
  let showSurveyButton = false;
  let showLastTestDate = false;
  let showSurvey = false;
  let showLocationVerify = false;
  let buttonText = "Start";
  let loading = false;
  $: dateTime = new Date(`${$currentTest.date}T${$currentTest.time}Z`);
  $: dateText = `Last test taken on ${dateTime.toLocaleDateString()} at ${dateTime.toLocaleTimeString()}`;
  $: locationConsentText =
    headerText === "Take a new test"
      ? "Please accept permission to get your location when prompted"
      : "";

  // Watches the $currentTest sveltestore and auto-updates the javascript variables in
  // real-time
  $: {
    if (!$currentTest.error) {
      if ($currentTest.isPrevTest) {
        loading = false;
        showStartButton = true;
        showSurveyButton = false;
        showLastTestDate = true;
        headerText = "Welcome Back!";
        buttonText = "Take another test";
      } else if ($currentTest.state === "not started") {
        headerText = "Take a new test";
      } else if ($currentTest.state === "finished") {
        headerText = "Complete";
        loading = false;
        showSurveyButton = true;
        showLastTestDate = true;
      }
    } else {
      loading = false;
      showLastTestDate = false;
      showStartButton = false;
      showSurveyButton = false;
      headerText = "Oops, there was an error";
    }
  }

  onMount(() => {
    // Check local storage for a last test result and display it if we have one
    speedTest.checkLocalForPrevTest();
  });

  // Because it takes a few seconds for the sveltestore to get set after a new speeed
  // test starts, we immediately change the values of these JS variables so the UI
  // updates as soon as a user clicks the button.
  const prepareTest = async () => {
    showStartButton = false;
    showLastTestDate = false;

    // Prepare does the following "waterfall" of operations in addition to setting up a
    // speed test:
    // .getIPAndApproxLocation()
    // .checkDBForPrevTest()
    // .getPreciseLocation()
    await speedTest.prepare();
    headerText = "Please verify your location";
    showLocationVerify = true;
    const data = await speedTest.verifyLocation();
  };

  const startTest = async () => {
    showLocationVerify = false;
    loading = true;
    showStartButton = false;
    showLastTestDate = false;
    headerText = "In Progress";
    await speedTest.startTest();
  };

  // TODO: write me
  const startSurvey = () => {
    console.log("Show survey");
    showSurvey = true;
    showStartButton = false;
  };

  // TODO: write or delete me
  const handleCancelTest = () => {
    speedTest.abortTest();
  };
</script>

{#if showSurvey}
  <div
    class="col-span-1 col-start-2 row-start-4 row-span-3 flex items-center justify-center"
  >
    <Survey />
  </div>
{:else}
  <div
    class="grid grid-rows-[repeat(12,_minmax(0,_1fr))] grid-cols-3 bg-white bg-opacity-80 p-4 w-full h-96 text-center
rounded-3xl"
  >
    <!-- Header text row  -->
    <div class="col-span-3 row-span-3 row-start-1">
      <h1 class="text-4xl py-2">{headerText}</h1>
      <p class="text-sm text-gray-500 italic">{locationConsentText}</p>
    </div>

    {#if showLocationVerify}
      <div class="col-span-3 row-start-4 row-span-3">
        <LocationVerify on:verified={startTest} />
      </div>
    {:else}
      <!-- Loading spinner, start button, survey button, or error row -->
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
            on:click={prepareTest}>{buttonText}</button
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
      {#if $currentTest.error}
        <div class="col-span-3 row-start-4 row-span-3">
          <p class="text-black text-lg">
            Please contact <a
              href="mailto:ruralnet@codeforuv.org"
              class="underline
        text-blue-500 cursor-pointer hover:text-blue-700"
              >ruralnet@codeforuv.org</a
            > with the following error message:
          </p>
        </div>
        <div class="col-span-3 row-start-7 row-span-3">
          <p class="text-red-600">{$currentTest.errorText}</p>
        </div>
      {/if}

      <!-- Last test date row -->
      {#if showLastTestDate}
        <div class="col-span-3 row-start-7 row-span-1">
          <p>{dateText}</p>
        </div>
      {/if}

      <!-- Metrics row -->
      {#if !$currentTest.error}
        {#if $currentTest.ping}
          <div
            class="col-span-1 flex flex-col my-auto row-start-[8] row-span-3"
          >
            <p class="text-3xl">
              {$currentTest.ping} <span class="text-2xl">ms</span>
            </p>
            <p class="text-gray-500">Ping</p>
          </div>
        {/if}
        {#if $currentTest.downloadSpeed}
          <div
            class="col-span-1 flex flex-col my-auto row-start-[8] row-span-3"
          >
            <p class="text-3xl">
              {$currentTest.downloadSpeed} <span class="text-2xl">mb/s</span>
            </p>
            <p class="text-gray-500">Download</p>
          </div>
        {/if}
        {#if $currentTest.uploadSpeed}
          <div
            class="col-span-1 flex flex-col my-auto row-start-[8] row-span-3"
          >
            <p class="text-3xl">
              {$currentTest.uploadSpeed} <span class="text-2xl">mb/s</span>
            </p>
            <p class="text-gray-500">Upload</p>
          </div>
        {/if}

        <!-- Location row -->
        {#if $currentTest.city}
          <div
            class="row-start-[11] row-span-1 col-start-2 text-center text-lg text-gray-500 italic "
          >
            <p>{$currentTest.city}</p>
            {#if $currentTest.locationPrecision}
              <p class="text-sm">
                (Location accuracy: {$currentTest.locationPrecision})
              </p>
            {/if}
          </div>
        {/if}

        <!-- Link to results map row -->
        {#if !loading}
          <div
            class="row-start-[12] row-span-1 col-start-2 text-center text-sm text-blue-500
  underline pt-5"
          >
            <a href="/results">Go to Results Map →</a>
          </div>
        {/if}
      {/if}
    {/if}
  </div>
{/if}
