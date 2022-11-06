<script>
    import {useCookies} from '$lib/helpers';
    import { onMount } from 'svelte';

    let cookiesAccepted

    onMount(() => {
        cookiesAccepted = useCookies.getCookieStatus()
    });
  
    function setAccept() {
        useCookies.setCookieStatus(true)
        cookiesAccepted = true
    }
  
    function setDecline() {
        useCookies.setCookieStatus(false)
        cookiesAccepted = false
    }

</script>

<style>
    .btn {
        @apply rounded py-2 px-5 m-2;
    }
    .accept {
        @apply bg-blue-400;
    }
    .decline {
        @apply bg-gray-400;
    }
</style>


<div class='flex'>
    <div>
        {#if cookiesAccepted == true}
            <div>Cookies Status: Accepted</div>
            <button class='btn btn-error' on:click={setDecline}>Decline Cookies</button>
        {:else if cookiesAccepted == false}
            <div>Cookies Status: Declined</div>
            <button class='btn btn-info' on:click={setAccept}>Accept Cookies</button>
        {:else }
            <div>Cookies Status: Undecided</div>
            <button class='btn btn-info' on:click={setAccept}>Accept Cookies</button>
            <button class='btn btn-error' on:click={setDecline}>Decline Cookies</button>
        {/if}
    </div>
</div>

  