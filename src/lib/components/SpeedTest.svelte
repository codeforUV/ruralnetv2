<script>
  import { createEventDispatcher, onMount } from "svelte";
  import { RuralTest } from "$lib/classes.js";

  // import FeatherIcon from "./FeatherIcon.svelte";
  import LoadingSpinner from "./LoadingSpinner.svelte";

  export let logging = false;
  let speedTest;
  let doneElement = null;
  let results = null;
  let ping = 0;
  let downloadSpeed = 0;
  let uploadSpeed = 0;
  let location = "";
  let locationArray = [];
  let city = "";
  let state = "";
  let start = true;
  let loading = false;
  let finished = false;
  let noPastResults = false;
  let initialLoadOfScreen = true;

  const dispatch = createEventDispatcher();

  onMount(() => {
    speedTest = new RuralTest(null, logging);

    //Listen for speed test to finish send back notification to parent
    //TODO DOMSubtreeModified is obsolete change to MutationObserver - https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver
    doneElement = document.getElementById("done");
    doneElement.addEventListener("DOMSubtreeModified", function () {
      if (doneElement.innerText === "Finished!") {
        loading = false;
        start = false;
        finished = true;
        dispatch("testComplete", true);
      }

      if (doneElement.innerText === "ping and jitter") {
        let time = 0;
        do {
          time += 10;
          setTimeout(() => {
            updateResults(speedTest.pageInterface);
          }, time);
        } while (time <= 15000);
      }
    });
    console.log(speedTest);
    if (speedTest.pageInterface) {
      if (speedTest.pageInterface.results === null) {
        noPastResults = true;
      } else {
        updateResults(speedTest.pageInterface);
      }
    }
  });

  const updateResults = async (pageInterface) => {
    results = pageInterface.results;
    ping = Math.round(results.ping * 10) / 10;
    downloadSpeed = Math.round(results.downloadSpeed * 10) / 10;
    uploadSpeed = Math.round(results.uploadSpeed * 10) / 10;
    location = results.city;
    locationArray = location.split(", ");
    city = locationArray[0];
    state = locationArray[1];
  };

  const handleStartTest = async () => {
    // const resp = await fetch(
    //   "https://ipgeolocation.abstractapi.com/v1/?api_key=de24077830ea4d369cb85de93599c45c"
    // );
    // const data = await resp.json();
    // console.log(data);

    loading = true;
    start = false;
    noPastResults = false;
    initialLoadOfScreen = false;

    ping = 0;
    downloadSpeed = 0;
    uploadSpeed = 0;
    location = "";

    speedTest.startTest();
  };

  const handleCancelTest = () => {
    speedTest.abortTest();
  };
</script>

<style>
  .results {
    margin-top: 2em;
  }

  .status {
    min-height: 60px;
    min-width: 60px;
    margin: 1em;
  }

  .status div {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .speed-metrics-row {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    margin: 0 0 1em 0;
    min-height: 70px;
  }

  .speed-metric {
    margin: 0 1em;
  }

  .metric-label {
  }

  .metric-value {
    color: black;
    font-size: 24pt;
  }

  .location {
    color: #666;
    font-size: 12pt;
    margin-bottom: 2em;
  }

  #start-speed-test:hover {
    cursor: pointer;
  }
</style>

<p id="done" hidden />

<div class="status">
  {#if finished === true}
    <div>
      <!-- <FeatherIcon iconName="check-circle" size="60" /> -->
      <p>Complete</p>
    </div>
  {:else if loading === true}
    <div>
      <LoadingSpinner />
      <p>In Progress</p>
    </div>
  {:else if start === true}
    <div on:click={handleStartTest} id="start-speed-test">
      <!-- <FeatherIcon iconName="play-circle" size="60" /> -->
      <p>Start Speed Test</p>
    </div>
  {/if}
</div>
<div class="results">
  {#if noPastResults === true}
    <div />
  {:else}
    {#if initialLoadOfScreen}
      <p>Last Speed Test Results:</p>
    {/if}
    <div class="speed-metrics-row">
      {#if ping}
        <div class="speed-metric">
          <div id="ping-value" class="metric-value">{ping}</div>
          <div id="ping-label" class="metric-label">Ping</div>
        </div>
      {/if}
      {#if downloadSpeed}
        <div class="speed-metric">
          <div id="download-value" class="metric-value">{downloadSpeed}</div>
          <div id="download-label" class="metric-label">Download</div>
        </div>
      {/if}
      {#if uploadSpeed}
        <div class="speed-metric">
          <div id="upload-value" class="metric-value">{uploadSpeed}</div>
          <div id="upload-label" class="metric-label">Upload</div>
        </div>
      {/if}
    </div>
  {/if}
</div>

<div>
  <p class="location">{location}</p>
  <!-- {#if !initialLoadOfScreen}
        <LocationUpdate bind:testResult={results}/>
    {/if} -->
</div>
