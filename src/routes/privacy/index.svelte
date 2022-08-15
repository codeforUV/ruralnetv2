<script>
import CookiesSetting from "$lib/components/CookiesSetting.svelte"


</script>

<style>

  p,
  li {
    @apply text-lg;
  }
</style>

<div class="container mx-auto p-8 prose">
  <h1 class=''>Privacy Settings</h1>
  <CookiesSetting/>
  <h2 class="">Privacy Policy</h2>
  <p>
    RuralNet ("The Website"), a project of Code for Upper Valley ("We", "Us"), respects your privacy and believes that you deserve to know what we do with your data.
  </p>
  <p>
    The website uses cookies to improve your speed testing experience. The website's cookies remember your device without requiring you to login.
  </p>
  <p>
    The following information is collected when you run the speed test:
  </p>
  <li>The speed of your internet service</li>
  <li>Your device's IP Address</li>
  <li>Your Internet Service Provider</li>
  <li>Your location (as determined by the mapping API) or by the information you provide. This will be shown on the results map. If you do not wish for your location to be precise, please just enter the town and state you are in.</li>
  <p>
    By using the website to perform speed tests, you agree to allow us to collect the above information.
  </p>
  <p>
    If you choose to complete the survey, your responses will only be used for this project.  No reported information from this survey will include identifiable information about individuals or their responses.
  </p>
  <p>
    We will not sell your information to any outside third parties.
  </p>

</div>
