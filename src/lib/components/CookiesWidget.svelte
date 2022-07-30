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


{#if show}
<div class='w-[98vw] min-h-[100px] fixed bottom-[1vh] left-[1vw] rounded border shadow bg-base-100 px-10 py-5 animate-[bounce_0.5s_1.5]'>
    <div class='text-lg font-bold'>Cookies</div> 
    <div class='flex flex-col lg:flex-row justify-between '>
        <div>
            We use Cookies to optimize your speed test experience. Read our full <a class='link' href='/privacy'>Privacy Policy</a> to learn more.
        </div>
        <div class='flex flex-col items-center sm:flex-row sm:justify-center'>
            {#if cookiesAccepted === true}
                <button class='btn btn-info' on:click={setDecline}>Decline Cookies</button>
            {:else if cookiesAccepted === false}
                <button class='btn btn-error' on:click={setAccept}>Accept Cookies</button>
            {:else if !cookiesAccepted}
                <button class='btn btn-info mr-3' on:click={setAccept}>Accept Cookies</button>
                <button class='btn btn-error' on:click={setDecline}>Decline Cookies</button>
            {/if}
        </div>
    </div>
</div>
{:else}

{/if}
  