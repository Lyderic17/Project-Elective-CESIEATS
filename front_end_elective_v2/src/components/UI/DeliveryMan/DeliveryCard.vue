<template>
  <div class="delivery-card">
    <div class="delivery-details">
      <h3>{{ info.deliveryAddress }}</h3>
      <p>Prise en charge : {{ info.pickupTime }}</p>
      <p>Livraison prévue : {{ info.deliveryTime }}</p>
    </div>
    <div class="delivery-actions">
      <button @click="confirmDelivery" class="btn-confirm">Confirmer la livraison</button>
      <button @click="reportIssue" class="btn-report">Signaler un problème</button>
    </div>
  </div>
</template>

<script>
import Options from 'vue-class-component';
import Vue from 'vue';
import axios from 'axios';

@Options({})
export default class DeliveryCard extends Vue {
  confirmDelivery() {
    const orderId = this.info.orderId;
    axios.post(`/api/delivery/orders/${orderId}/confirm`)
      .then(() => {
        console.log('Livraison confirmée');
        // Faire les actions nécessaires après confirmation de la livraison
      })
      .catch((error) => {
        console.error('Erreur lors de la confirmation de la livraison :', error);
      });
  }

  reportIssue() {
    const orderId = this.info.orderId;
    axios.post(`/api/delivery/orders/${orderId}/report-issue`)
      .then(() => {
        console.log('Problème signalé');
        // Faire les actions nécessaires après signalement du problème
      })
      .catch((error) => {
        console.error('Erreur lors du signalement du problème :', error);
      });
  }
}
</script>

<style scoped>
.delivery-card {
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 10px;
  margin-bottom: 10px;
}

.delivery-details {
  margin-bottom: 10px;
}

.delivery-actions {
  text-align: right;
}

.btn-confirm {
  background-color: green;
  color: white;
  padding: 5px 10px;
  border: none;
  border-radius: 3px;
  cursor: pointer;
}

.btn-report {
  background-color: red;
  color: white;
  padding: 5px 10px;
  border: none;
  border-radius: 3px;
  cursor: pointer;
}
</style>
