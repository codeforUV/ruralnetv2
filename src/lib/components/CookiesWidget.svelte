<script>
	import { onMount } from 'svelte';
    import {useCookies} from '$lib/helpers'

    let cookiesAccepted
    let show = false

    onMount(() => {
        cookiesAccepted = useCookies.getCookieStatus()
        if(!cookiesAccepted) {
            show = true
        }
    });

   
    function setAccept() {
        useCookies.setCookieStatus(true)
        cookiesAccepted = true
        show = false
    }
  
    function setDecline() {
        useCookies.setCookieStatus(false)
        cookiesAccepted = false
        show = false
    }

</script>

<style>
    .btn {
        @apply rounded py-2 px-5 m-3;
    }
    .accept {
        @apply bg-blue-400;
    }
    .decline {
        @apply bg-gray-400;
    }
</style>


{#if show}
<div class='w-[98vw] min-h-[100px] fixed bottom-[1vh] left-[1vw] bg-slate-600 text-white px-10 py-5 animate-[bounce_0.5s_1.5]'>
    <h2>Cookies</h2> 
    <div class='flex flex-col lg:flex-row justify-between '>
        <div>
            We use Cookies to optimize your speed test experience. Read our full <a href='/privacy'>Privacy Policy</a> to learn more.
        </div>
        <div>
            {#if cookiesAccepted === true}
                <button class='btn accept' on:click={setDecline}>Decline Cookies</button>
            {:else if cookiesAccepted === false}
                <button class='btn decline' on:click={setAccept}>Accept Cookies</button>
            {:else if !cookiesAccepted}
                <button class='btn accept' on:click={setAccept}>Accept Cookies</button>
                <button class='btn decline' on:click={setDecline}>Decline Cookies</button>
            {/if}
        </div>
    </div>
</div>
{:else}

{/if}
  