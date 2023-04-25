<script>
  import { onMount } from "svelte";
  import { useCookies } from "$lib/helpers";

  let cookiesAccepted;
  let show = false;

  onMount(() => {
    cookiesAccepted = useCookies.getCookieStatus();
    if (cookiesAccepted === null) {
      show = true;
    }
  });

  function setAccept() {
    useCookies.setCookieStatus(true);
    cookiesAccepted = true;
    show = false;
  }

  function setDecline() {
    useCookies.setCookieStatus(false);
    cookiesAccepted = false;
    show = false;
  }
</script>

{#if show}
  <div
    class="w-[98vw] min-h-[100px] fixed bottom-[1vh] left-[1vw] rounded shadow bg-base-300 bg-opacity-90 px-10 py-5 animate-[bounce_0.5s_1.5]"
  >
    <div class="text-lg font-bold">Cookies 🍪</div>
    <div class="flex flex-col lg:flex-row justify-between">
      <div>
        We use Cookies to optimize your speed test experience. Read our full <a
          class="link"
          href="/privacy">Privacy Policy</a
        > to learn more.
      </div>
      <div class="flex flex-row justify-center">
        {#if cookiesAccepted === true}
          <button class="btn btn-info m-1" on:click={setDecline}>Decline</button
          >
        {:else if cookiesAccepted === false}
          <button class="btn btn-error m-1" on:click={setAccept}>Accept</button>
        {:else if !cookiesAccepted}
          <button class="btn btn-info m-1" on:click={setAccept}>Accept</button>
          <button class="btn btn-error m-1" on:click={setDecline}
            >Decline</button
          >
        {/if}
      </div>
    </div>
  </div>
{/if}
