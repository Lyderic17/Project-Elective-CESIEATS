<template>
  <div>
    <l-map
    :center="center"
    :zoom="zoom"
    :key="mapKey"
     class="map"
     ref="map"
     @update:zoom="zoomUpdated"
     @update:center="centerUpdated">
      <l-tile-layer :url="url"></l-tile-layer>
      <l-marker v-for="marker in markers" :key="marker.id" :lat-lng="marker.coordinates">
        <l-icon :icon-url="marker.imageUrl" />
      </l-marker>
    </l-map>
  </div>
</template>

<script lang="js">
import {
  LMap, LMarker, LTileLayer, LIcon,
} from 'vue2-leaflet';
import 'leaflet/dist/leaflet.css';
import { w3cwebsocket as W3CWebSocket } from 'websocket';

export default {
  components: {
    LMap,
    LMarker,
    LTileLayer,
    LIcon,
  },
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  data() {
    return {
      mapKey: Date.now(),
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      center: [46.17322, -1.17731],
      zoom: 17,
      markers: [
        {
          id: 1,
          imageUrl: 'https://img.icons8.com/ios-filled/50/fa314a/marker.png',
          coordinates: [48.9032190343066, 2.1929470176062846],
        },
        {
          id: 2,
          imageUrl: 'https://img.icons8.com/ios-glyphs/30/4a90e2/waiter.png',
          coordinates: [48.90220100045335, 2.1918905029658626],
        },
        {
          id: 3,
          imageUrl:
            'https://img.icons8.com/material-sharp/24/00/restaurant-on-site.png',
          coordinates: [48.89661696921462, 2.2125147140911126],
        },
      ],
      client: new W3CWebSocket('ws://localhost:3000'), // Your websocket server URL here
    };
  },
  methods: {
    zoomUpdated(zoom) {
      this.zoom = zoom;
      console.log(this.markers);
    },
    centerUpdated(center) {
      this.center = center;
    },
  },
  mounted() {
    this.client.onopen = () => {
      console.log('WebSocket Client Connected');
    };
    this.client.onmessage = (message) => {
      const data = JSON.parse(message.data);
      console.log('this is inside the onmessage');
      this.markers = this.markers.map((marker) => {
        if (marker.id === data.deliveryPersonId) {
          // Update the coordinates of the marker
          console.log('this is inside the if of websock');
          // eslint-disable-next-line no-param-reassign
          marker.coordinates = [data.latitude, data.longitude];
        }
        return marker;
      });

      // Update mapKey to force map refresh
      this.mapKey = Date.now();
    };
  },
};
</script>

<style>
.map {
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>
