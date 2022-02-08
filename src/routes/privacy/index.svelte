<script>
  // import { onMount } from 'svelte';
  // let cookieOK, explicitUserStance;
  // onMount(() => {
  //   cookieOK = CookieUtility.consentStatus().consented;
  //   explicitUserStance = CookieUtility.consentStatus().explicit;
  // });

  function agreeUpdate() {
    // CookieUtility.agree();
    cookieOK = true;
    explicitUserStance = true;
  }

  function declineUpdate() {
    // CookieUtility.decline();
    cookieOK = false;
    explicitUserStance = true;
  }
</script>

<style>
  button {
    @apply py-2 px-4 bg-gray-300 border border-black active:bg-gray-400;
  }
</style>

<div class="p-8">
  <h1 class="text-4xl mb-4">RuralNet Privacy Policy</h1>
  <ol class="list-decimal leading-loose pl-6">
    <li>RuralNet and CodeForUV respect your privacy</li>
    <li>
      RuralNet uses Cookies and you deserve to know how we use them to track you
    </li>
    <li>
      RuralNet cookies do not track outside of the RuralNet website, nor do
      third party cookies track on RuralNet.
    </li>
    <li>
      We don't care what you do in the internet, we just want to know how fast
      it is
    </li>
    <li>
      We use cookies to remember each user, to make subsequent speed tests
      faster and to enhance user experience by remembering your previous tests
      from each device
    </li>
    <li>You may enable or disable cookies at any time</li>
    <li>
      Cookies are enabled by default as an essential part of our website.
      However, any user may opt out (or opt back in) of cookies at any time.
    </li>
    <li>
      Opting out of cookies will disrupt the use of certain parts of the
      RuralNet website, such as the "your tests" page
    </li>
    <li>
      As part of our data collection, RuralNet also collect information such as
      your ISP and approximate location coordinates
    </li>
  </ol>
  <p class="my-8 font-bold">
    This Privacy Policy is not final, just a placeholder with sentances that
    seem close enough, maybe, until a more qualified individual or team writes a
    proper and substantive privacy policy.
  </p>

  <h2 class="text-2xl mb-2">Your Cookie Agreement Status</h2>
  <p class="italic">You can always change your mind</p>
  <!-- {#if explicitUserStance} -->
  <!-- {#if cookieOK} -->
  <p class="font-bold">You have accepted cookies</p>
  <p class="italic">
    Warning! Declining cookies may erase the "Your Tests" page from your
    perspective permenantly! The results will not be lost, but your device will
    no longer be associated with them.
  </p>
  <button on:click={declineUpdate}>Decline Cookies</button>
  <!-- {:else} -->
  <p><strong>You have declined cookies</strong></p>
  <button on:click={agreeUpdate}>Accept Cookies</button>
  <!-- {/if} -->
  <!-- {:else} -->
  <p>
    <strong
      >Cookies have been accepted by default. You may make a choice below.</strong
    >
  </p>
  <button on:click={agreeUpdate}>Accept Cookies</button>
  <button on:click={declineUpdate}>Decline Cookies</button>
  <!-- {/if} -->
</div>
