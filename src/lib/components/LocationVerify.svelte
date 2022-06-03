<script>
  import { createEventDispatcher } from "svelte";
  import { currentTest } from "$lib/stores";

  let showAddressInput = false;
  let addressInput = "";
  let errorText = "";
  const dispatch = createEventDispatcher();

  const startTest = () => {
    // Emit a verified event to SpeedTest.svelte
    dispatch("verified");
  };

  // NOTE: We may want to battle-test santizing the input a bit more. This should catch
  // the most common cases tho
  const queryAddress = async (e) => {
    const formData = new FormData(e.target);
    const location = formData.get("address");
    try {
      let city, state;
      if (location.includes(",")) {
        city = location.split(",")[0].trim();
        state = location.split(",")[1].trim();
      }
      if (!city || !state || !location.includes(",")) {
        errorText = `Please input as: City, State Initials. For example: Hartford, VT`;
        throw `${errorText}`;
      }
      if (state.length > 2) {
        errorText = `Please use State Initials instead of full name`;
        throw `${errorText}`;
      }
      const resp = await fetch(`/api/v1/verifyLocation?location=${location}`);
      const verification = await resp.json();
      if (verification.verified) {
        // Emit an update event to SpeedTest.svelte
        dispatch("updateLocation", verification);
      } else {
        String.prototype.toProperCase = function () {
          return this.replace(/\w\S*/g, function (txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
          });
        };
        let cityResp = verification.checkedAgainst.split(",")[0].toProperCase();
        let stateResp = verification.checkedAgainst.split(",")[1].toUpperCase();
        if (cityResp && stateResp) {
          errorText = `Location not found. Did you mean: ${cityResp}, ${stateResp}`;
        } else {
          errorText = "Sorry we couldn't find that location";
        }
      }
    } catch (err) {
      console.error(err);
    }
  };
</script>

<div class="flex flex-col gap-y-6">
  <div class="text-xl">
    {#if showAddressInput}
      What city and state are you in?
    {:else}
      Are you in: <span class="italic font-semibold">{$currentTest.city}</span>
    {/if}
  </div>
  <div class="flex justify-center space-x-8">
    {#if showAddressInput}
      <div class="flex flex-col w-4/6">
        <form class="flex" on:submit|preventDefault={queryAddress}>
          <input
            type="text"
            class="appearance-none block w-full bg-white text-gray-700 border
        border-gray-200 rounded py-2 px-4 leading-tight focus:outline-none
        focus:border-gray-500"
            name="address"
            required
            placeholder={$currentTest.city}
          />
          <button
            class="px-8 py-2 bg-blue-500 hover:bg-blue-700 text-white cursor-pointer
        text-lg"
            type="submit">Submit</button
          >
        </form>
        {#if errorText}
          <p class="mt-4 text-sm italic text-red-500">{errorText}</p>
        {/if}
      </div>
    {:else}
      <button
        class="px-8 py-4 bg-red-500 hover:bg-red-700 text-white rounded-full cursor-pointer text-lg"
        on:click={() => (showAddressInput = true)}>Not quite</button
      >
      <button
        class="px-8 py-4 bg-green-500 hover:bg-green-700 text-white rounded-full cursor-pointer text-lg"
        on:click={startTest}>Yes</button
      >
    {/if}
  </div>
</div>
