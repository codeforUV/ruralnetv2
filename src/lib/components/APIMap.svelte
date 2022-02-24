<script>
    import { onMount } from 'svelte';
    import { browser } from '$app/env';

    onMount(async () => {
        if(browser) {
            const leaflet = await import('leaflet');

            const map = leaflet.map('map').setView([43.827, -72.295], 10);
            // -72.305, 43.827

            leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map);

            // leaflet.marker([51.5, -0.09]).addTo(map)
            //     .bindPopup('A pretty CSS3 popup.<br> Easily customizable.')
            //     .openPopup();
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