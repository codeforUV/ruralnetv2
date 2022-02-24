<script>
    import { onMount } from 'svelte';
    import { browser } from '$app/env';

    export let data = [];

    onMount(async () => {
        if(browser) {

            const getIcon = (speed) => {
                const speedIcon = leaflet.icon({
                        iconUrl: `https://img.icons8.com/material/24/${determineColorBySpeed(speed)}/filled-circle.png`,
                    })
                return speedIcon;
            }

            const determineColorBySpeed = (speed) => {
                if (speed < 5) {
                    return 'ff0000' //Red
                } else if (speed >= 5 && speed < 100) {
                    return 'FFFF00' //Yellow
                } else if (speed > 100) {
                    return '00FF00' //Green
                } else {
                    return '0000FF' //Blue
                }
            }

            const leaflet = await import('leaflet');

            const map = leaflet.map('map').setView([43.827, -72.295], 10);
            
            

            leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map);

            if (data) {
                data.map((speedTest) => {
                    if (speedTest.latitude && speedTest.longitude) {
                        leaflet.marker([speedTest.latitude, speedTest.longitude], {icon: getIcon(speedTest.downloadSpeed)}).addTo(map)
                    }
                })
            }
            
        }
    });
</script>


<main>
    <div id="map"></div>
</main>

<style>
    @import 'https://unpkg.com/leaflet@1.7.1/dist/leaflet.css';
    main #map {
        height: 800px;
    }
</style>