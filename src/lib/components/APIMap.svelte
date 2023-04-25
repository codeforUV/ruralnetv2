<script>
  import { onMount } from "svelte";
  import { browser } from "$app/environment";

  export let data = [];

  const getPopupContent = (speedTest) => {
    return `
            <div>
                <div>Ping: ${speedTest.ping}ms<div>
                <div>Download: ${speedTest.downloadSpeed}Mbps<div>
                <div>Upload: ${speedTest.uploadSpeed}Mbps<div>
                <div class="font-bold">${speedTest.city}<div>
            </div>
        `;
  };

  let map = null;

  onMount(async () => {
    if (browser) {
      const leaflet = await import("leaflet");

      const getIcon = (speed) => {
        const speedIcon = leaflet.icon({
          iconUrl: `https://img.icons8.com/material/24/${determineColorBySpeed(
            speed
          )}/filled-circle.png`,
        });
        return speedIcon;
      };

      const determineColorBySpeed = (speed) => {
        if (speed < 5) {
          return "FF6162"; //Red
        } else if (speed >= 5 && speed < 100) {
          return "FFD972"; //Yellow
        } else if (speed > 100) {
          return "77A56B"; //Green
        } else {
          return "0F528C"; //Blue
        }
      };

      map = leaflet
        .map("map", { scrollWheelZoom: false })
        .setView([43.827, -72.295], 10);

      leaflet
        .tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        })
        .addTo(map);

      if (data.data) {
        data.data.map((speedTest) => {
          if (speedTest.latitude && speedTest.longitude) {
            const popupContent = getPopupContent(speedTest);

            leaflet
              .marker([speedTest.latitude, speedTest.longitude], {
                icon: getIcon(speedTest.downloadSpeed),
              })
              .addTo(map)
              .bindPopup(popupContent);
          }
        });
      }
    }
  });

  const handleResize = () => {
    setTimeout(function () {
      map.invalidateSize();
    }, 310);
  };
</script>

<div id="map" class="min-h-full min-w-full z-0" on:mouseenter={handleResize} />

<style>
  @import "https://unpkg.com/leaflet@1.7.1/dist/leaflet.css";
</style>
