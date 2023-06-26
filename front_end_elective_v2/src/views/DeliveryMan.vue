<template>
  <div>
    <ul>
      <li v-for="order in availableOrders" :key="order.id">
        <h3>{{ order.title }}</h3>
        <p>{{ order.description }}</p>
        <!-- Afficher d'autres détails de la commande -->
        <button @click="acceptOrder(order.id)">Accepter</button>
        <button @click="rejectOrder(order.id)">Refuser</button>
      </li>
    </ul>
    <div class="deliveryMan" style="padding: 30px">
      <v-row align="center" no-gutters style="height: 150px v-block">
        <v-col>
          <v-banner>Commandes en attente :</v-banner>
        </v-col>
        <v-col>
          <v-banner>Commande en cours :</v-banner>
        </v-col>
      </v-row>
      <v-row align="center" no-gutters style="height: 150px v-block">
        <v-col>
          <div v-for="order in available_orders" :key="order.id">
            <DeliveryCard :info="order" />
          </div>
        </v-col>
        <v-col>
          <v-img
            src="https://i.imgur.com/dNbSnwK.jpg"
            height="200px"
            width="200px"
            class="ma-auto"
          ></v-img>
          <div v-for="order in current_orders" :key="order.id">
            <DeliveryCard :info="order" />
          </div>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script>
import Options from 'vue-class-component';
import Vue from 'vue';
import axios from 'axios';
import DeliveryCard from '../components/UI/DeliveryMan/DeliveryCard.vue';
import DeliveryMap from '../components/UI/DeliveryMan/DeliveryMap.vue';

@Options({
  components: {
    DeliveryCard,
    DeliveryMap,
  },
  methods: {
    getAvailableOrders() {
      axios.get('/api/delivery/orders/available')
        .then((response) => {
          this.available_orders = response.data;
        })
        .catch((error) => {
          console.error('Erreur lors de la récupération des commandes disponibles :', error);
        });
    },
    async acceptOrder(orderId) {
      try {
        await axios.put(`/api/delivery/${orderId}/accept`);
        // Mettre à jour la liste des commandes disponibles après avoir accepté la commande
        this.getAvailableOrders();
      } catch (error) {
        console.error('Erreur lors de l\'acceptation de la commande :', error);
      }
    },
    async rejectOrder(orderId) {
      try {
        await axios.put(`/api/delivery/${orderId}/reject`);
        // Mettre à jour la liste des commandes disponibles après avoir refusé la commande
        this.getAvailableOrders();
      } catch (error) {
        console.error('Erreur lors du refus de la commande :', error);
      }
    },
  },
  data() {
    return {
      available_orders: [],
      current_orders: [],
    };
  },
  beforeMount() {
    this.getAvailableOrders();
  },
})
export default class DeliveryMan extends Vue {}
</script>

<style scoped>
/* Styles spécifiques au composant DeliveryMan */
</style>
