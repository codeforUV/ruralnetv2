<script>
    import esriConfig from '@arcgis/core/config'
    import Map from '@arcgis/core/Map'
    import MapView from '@arcgis/core/views/MapView'
    import Graphic from '@arcgis/core/Graphic'
    import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer'
    import Locate from '@arcgis/core/widgets/Locate'

    export let data = [];

    //This API Key is read only, @colbyhemond has set up restrictions around it as to what services are allowed and Referrers
    //TODO: Create a Code for UV account on Arc GIS so our team can have access to manage and rotate the API Key
    esriConfig.apiKey = 'AAPK234d2cbbeb2b4e0ba81514087b69c0b5M7sB-axZsH1fETdkNbUMLr2FYob-swNZHohVKx3-v3e6TMN_dTV0HJRcoge2QILS'

    const createMap = (domNode) => {
        const map = new Map({
            basemap: "arcgis-topographic" // Basemap layer service
        });

        const view = new MapView({
            map: map,
            center: [-72.305, 43.827],
            zoom: 9, 
            container: domNode
        });

        const locate = new Locate({
            view: view,
            useHeadingEnabled: false,
            goToOverride: function (view, options) {
                options.target.scale = 1500;
                return view.goTo(options.target);
            }
        });

        view.ui.add(locate, "top-left");

        const graphicsLayer = new GraphicsLayer();
        map.add(graphicsLayer);
        
        const buildPointGraphic = (data) => {
            const pointGraphic = new Graphic({
                geometry: buildPoint(data.longitude, data.latitude),
                symbol: buildMarkerSymbol(data.downloadSpeed)
            });
            graphicsLayer.add(pointGraphic);
        }

        const determineMarkerColor = (downloadSpeed) => {
            if (downloadSpeed < 5) {
                return 'red'
            } else if (downloadSpeed >= 5 && downloadSpeed < 100) {
                return 'yellow'
            } else if (downloadSpeed > 100) {
                return 'green'
            } else {
                return 'blue'
            }
        }

        const buildMarkerSymbol = (downloadSpeed) => {
            return {
                type: "simple-marker",
                color: determineMarkerColor(downloadSpeed),
                outline: {
                    color: [255, 255, 255],
                    width: 1
                }
            }
        }

        const buildPoint = (longitude, latitude) => {
            return {
                type: "point",
                longitude: longitude,
                latitude: latitude
            }
        }

        if (data) {
            data.map((document) => {
                if (document.downloadSpeed > 0 && document.longitude !== null) {
                    buildPointGraphic(document)
                }
            })
        }

    };

</script>

<style>
</style>

<div id="view" class="w-full h-full" use:createMap></div>