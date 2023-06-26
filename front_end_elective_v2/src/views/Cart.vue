<template>
  <div class="dishes">
    <v-row no-gutters>
      <v-col>
        <v-card class="pa-2" outlined tile>
          <div v-if="Orders.length > 0">
            <div v-for="Plat in Orders" :key="Plat">
              <OrderInCart :menuId="Plat"/>
            </div>
          </div>
          <div v-else>
            <p>Votre Panier est vide</p>
          </div>
        </v-card>
      </v-col>
      <v-col>
        <v-card class="pa-2" outlined tile>
        <DeliveryInfos :deliveryData="{ adresse: 'test', number: 'testcommand',
        code: 'pricecommand', complement: 'adressecommande', }" />
        </v-card>
      </v-col>
    </v-row>
    <v-card-actions  class="justify-center">
      <v-btn outlined rounded text @click="pay"> Payer </v-btn>
    </v-card-actions>
  </div>
</template>

<script>
import Options from 'vue-class-component';
import Vue from 'vue';
import axios from 'axios';
import OrderInCart from '../components/UI/Cart/OrderInCart.vue';
import DeliveryInfos from '../components/UI/Cart/DeliveryInfos.vue';

@Options({
  components: {
    OrderInCart,
    DeliveryInfos,
  },
  data() {
    return {
      Orders: null,
      data: null,
      error: null,
      clientId: null,
    };
  },
  methods: {
    pay() {
      this.data = {
        clientId: this.clientId.userId,
        address: {
          country: 'France',
          zipcode: '75000',
          city: 'Paris',
          address: '24 rue de mont martre',
        },
        date: '2021-07-02T08:28:32.738Z',
        status: 'open',
        taxes: { value: 20, currency: 'EUR' },
        menus: [],
        restaurantId: '60de1250cf2ab4e2d89b0ea2',
      };

      // Ajoutez les menus sélectionnés à la liste "menus" de la commande
      this.Orders.forEach((plat) => {
        this.data.menus.push({
          id: plat.id,
          price: plat.price,
        });
      });

      this.validate(this.data);
    },
    loadBasket() {
      this.Orders = this.$store.getters.getBasket;
      this.clientId = this.$store.getters.getUser;
      console.log(this.Orders);
    },
    async validate(data) {
      console.log(data);
      const response = await axios.post('/order/', data).catch(() => { this.error = true; });
      if (response.status === 204) {
        this.$router.push('/order');
        this.$store.dispatch('ClearBasket');
      }
    },
  },
  async created() {
    this.loadBasket();
  },
})
export default class Cart extends Vue {}
</script>
