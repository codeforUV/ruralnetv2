<script>
  import { Map, Geocoder, Marker, controls } from '@beyonk/svelte-mapbox'

    let mapComponent
    let mapboxToken = 'pk.eyJ1IjoiY29sYnloZW1vbmQiLCJhIjoiY2wwMHk3c2ViMGxyNDNpbzAxbHhudzd0cSJ9.jy6YERoPDj1_F4vuYLY9xw'
  
  const { GeolocateControl, NavigationControl, ScaleControl } = controls

  // Usage of methods like setCenter and flyto
//   mapComponent.setCenter([lng,lat],zoom) // zoom is optional
//   mapComponent.flyTo({center:[lng,lat]}) // documentation (https://docs.mapbox.com/mapbox-gl-js/example/flyto)

  // Define this to handle `eventname` events - see [GeoLocate Events](https://docs.mapbox.com/mapbox-gl-js/api/markers/#geolocatecontrol-events)
  function eventHandler (e) {
    const data = e.detail
    // do something with `data`, it's the result returned from the mapbox event
  }
</script>

<style>
    :global(.mapboxgl-map) {
        height: 100vh;
        width: 100vw;
    }
</style>

<Geocoder value="(Near London)" accessToken={mapboxToken} on:result={placeChanged} on:clear={() => mapComponent.setCenter({ lng: 0, lat: 0 })} />
<Map
  accessToken={mapboxToken}
  bind:this={mapComponent} 
  on:recentre={e => console.log(e.detail.center.lat, e.detail.center.lng) } 
  options={{ scrollZoom: false }} 
>
  <Marker lat={someLat} lng={someLng} color="rgb(255,255,255)" label="some marker label" popupClassName="class-name" /> // built in Marker component
  <NavigationControl />
  <GeolocateControl options={{ some: 'control-option' }} on:eventname={eventHandler} />
  <ScaleControl />
</Map>