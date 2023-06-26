<template>
    <div class="delivery-map">
      <l-map :zoom="zoom" :center="center">
        <l-tile-layer :url="tileLayerUrl" />
        <l-marker :lat-lng="markerLatLng" />
      </l-map>
    </div>
  </template>
  
  <script>
  import { LMap, LTileLayer, LMarker } from 'vue2-leaflet';
  import 'leaflet/dist/leaflet.css';
  
  export default {
    name: 'DeliveryMap',
    components: {
      LMap,
      LTileLayer,
      LMarker,
    },
    data() {
      return {
        zoom: 13,
        center: [48.8566, 2.3522], // Coordonnées du centre de la carte
        tileLayerUrl: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', // URL du service de tuiles de carte
        markerLatLng: [48.8566, 2.3522], // Coordonnées du marqueur
      };
    },
  }
  </script>
  
  <style scoped>
  .delivery-map {
    height: 400px; /* Ajustez la hauteur selon vos besoins */
  }
  </style>
  