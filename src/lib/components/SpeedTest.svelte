<script>
  // Main speed test component that makes heavy use of the RuralText class in
  // classes.js To show data from an on-going speed test or previous test results, the
  // class saves this data to a currentTest svelte store which is read by this component
  // to reactively update the UI.
  import { createEventDispatcher, onMount } from "svelte";
  import { RuralTest } from "$lib/classes.js";
  import { page } from '$app/stores';
  import { currentTest } from "$lib/stores";
  import { cookies } from "$lib/stores";
  import { useCookies } from '$lib/helpers'

  import Survey from "./Survey.svelte";
  import LoadingSpinner from "./LoadingSpinner.svelte";
  import LocationVerify from "./LocationVerify.svelte";

  // Run speed test with console logging when in development
  let logging = import.meta.env.DEV;
  // Enable data upload by default
  let upload = true;
  const dispatch = createEventDispatcher();

  // Initialize a new instance of the class that handles speed tests
  const speedTest = new RuralTest(logging, upload, $page.data.userid);

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
      if (!useCookies.getCookieStatus()) {
        showStartButton = true;
        showSurveyButton = false;
        showLastTestDate = false;
        showSurvey = false;
        showLocationVerify = false;
        buttonText = "Start";
        console.log($currentTest.state);
        if ($currentTest.state === "not started") {
          headerText = "Internet Speed Test";
        } else if ($currentTest.state === "download" || $currentTest.state === "upload") {
          showStartButton = false;
        } else if ($currentTest.state === "finished") {
          headerText = "Complete";
          loading = false;
          showSurveyButton = true;
          showLastTestDate = true;
        }
      } else {
        if ($currentTest.isPrevTest) {
          loading = false;
          showStartButton = true;
          showSurveyButton = false;
          showLastTestDate = true;
          headerText = "Welcome Back!";
          buttonText = "Take another test";
        } else if ($currentTest.state === "not started") {
          headerText = "Internet Speed Test";
        } else if ($currentTest.state === "finished") {
          headerText = "Complete";
          loading = false;
          showSurveyButton = true;
          showLastTestDate = true;
        }
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
    if (useCookies.getCookieStatus() === true) {
      speedTest.checkLocalForPrevTest();
    } else {
      console.log('reset test');
      speedTest.resetLocalTest()
    }
  });

  // Because it takes a few seconds for the sveltestore to get set after a new speeed
  // test starts, we immediately change the values of these JS variables so the UI
  // updates as soon as a user clicks the button.
  const prepareTest = async () => {
    showStartButton = false;
    showLastTestDate = false;

    // Prepare does the following "waterfall" of operations in addition to setting up a
    // speed test:
    // .getIPAndApproxLocation
    // .checkDBForPrevTest
    // .getPreciseLocation
    await speedTest.prepare();
    headerText = "Please verify your location";
    showLocationVerify = true;
  };

  const updateLocation = async (e) => {
    speedTest.testData.latitude = e.detail.latlng.lat;
    speedTest.testData.longitude = e.detail.latlng.lng;
    speedTest.testData.city = e.detail.city;
    await startTest();
  };

  const startTest = async () => {
    showLocationVerify = false;
    loading = true;
    showStartButton = false;
    showLastTestDate = false;
    showSurveyButton = false;
    headerText = "In Progress";
    await speedTest.startTest();
  };

  const startSurvey = () => {
    showSurvey = true;
    showStartButton = false;
  };

  // TODO: write or delete me
  const handleCancelTest = () => {
    speedTest.abortTest();
  };
</script>

{#if showSurvey}
 
    <Survey />

{:else}
  <div class="bg-base-100 bg-opacity-80 rounded-xl prose flex flex-col items-center p-4 w-100 min-h-[450px]">
    <!-- Header text row  -->
    <div class="flex-none text-center">
      <h1 class="">{headerText}</h1>
      <p class="">{locationConsentText}</p>
    </div>

    {#if showLocationVerify}
        <LocationVerify
          on:verified={startTest}
          on:updateLocation={updateLocation}
        />
    {:else}
      <!-- Loading spinner, start button, survey button, or error row -->
      {#if loading}
        <div
          class=""
        >
          <LoadingSpinner />
        </div>
      {/if}
      {#if showStartButton}
        <div class="flex flex-1 items-center">
          <button
            class="btn btn-lg btn-primary"
            on:click={prepareTest}>{buttonText}</button
          >
        </div>
      {/if}
      {#if showSurveyButton}
        <div class="">
          <button
            class="btn btn-success"
            on:click={startTest}>Take Another Test</button
          >
          <button
            class="btn btn-info"
            on:click={startSurvey}>Take a Quick Survey!</button
          >
        </div>
      {/if}
      {#if $currentTest.error}
        <div class="">
          <p class="">
            Please contact <a
              href="mailto:ruralnet@codeforuv.org"
              class="link"
              >ruralnet@codeforuv.org</a
            > with the following error message:
          </p>
        </div>
        <div class="">
          <p class="text-red-600">{$currentTest.errorText}</p>
        </div>
      {/if}

      <!-- Last test date row -->
      {#if showLastTestDate}
        <div class="">
          <p>{dateText}</p>
        </div>
      {/if}

      <!-- Metrics row -->
      
      {#if !$currentTest.error}
      
        <div class="flex justify-center w-3/4">
          {#if $currentTest.downloadSpeed}
            <div class="flex flex-col w-1/2" >
              <div class="text-3xl self-center md:text-5xl">{$currentTest.downloadSpeed}</div>
              <div class="self-center">Download</div>
              <span class='text-xs self-center'>(mb/s)</span>
            </div>
          {/if}
          {#if $currentTest.uploadSpeed}
            <div class="flex flex-col w-1/2" >
              <div class="text-3xl self-center md:text-5xl">{$currentTest.uploadSpeed}</div>
              <div class="self-center">Upload</div>
              <span class='text-xs self-center'>(mb/s)</span>
            </div>
          {/if}
        </div>
        <div class='flex justify-center basis-full w-full pt-2 pb-5'>
          {#if $currentTest.ping}
            <div class="" >
              <div class="text-xs">Ping: {$currentTest.ping}<span class="">ms</span> </div>
            </div>
          {/if}
        </div>
      
        <!-- Location row -->
        {#if $currentTest.city}
          <div class="flex flex-col items-center flex-wrap pb-5">
            <div class='flex'>
              <div>
                <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" class="css-i6dzq1"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
              </div>
              <div>{$currentTest.city}</div>
            </div>
            {#if $currentTest.locationPrecision}
              <div class="text-xs">
                (Location accuracy: {$currentTest.locationPrecision})
              </div>
            {/if}
          </div>
        {/if}

        <!-- Link to results map row -->
        {#if !loading}
          <div class="link flex-none">
            <a href="/results">Go to Results Map →</a>
          </div>
        {/if}
      {/if}
    {/if}
  </div>
{/if}
