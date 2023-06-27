<template>
    <div>
      <router-link to='/delivery'>Delivery</router-link>
      <!-- Affichage spécifique pour le client -->
      <div v-if="getUserRole === 5">
      <!-- Composants et fonctionnalités spécifiques pour le client -->
      <div class='d-flex align-content-start flex-wrap justify-space-around'>
      <div v-for='resto in restaurants' :key='resto.name'>
        <RestoCard :info='resto' />
      </div>
    </div>
      <p>Interface du Client</p>
      <router-link to="/account">Account</router-link>
      <router-link to="/sponsorship">Sponsorship</router-link>
      <router-link to="/notification">Notification</router-link>
      <router-link to="/research">Research</router-link>
    </div>

        <!-- Affichage spécifique pour le livreur -->
        <div v-if="getUserRole === 4">
      <!-- Composants et fonctionnalités spécifiques pour le livreur -->
      <p>Interface du Livreur</p>
      <router-link to="/deliveries">Liste des livraisons</router-link>
      <router-link to="/accept-delivery">Accepter une livraison</router-link>
      <router-link to="/acquit-delivery">Acquitter une livraison</router-link>
      <router-view></router-view>
    </div>

    <div v-if="getUserRole === 3">
    <!-- Autres éléments de la page Home -->
    <router-link to="/restaurants/create">Create Restaurant</router-link>
    <!-- Bouton Dashboard Restaurant -->
    <router-link to="/restaurateur">
      <button>Dashboard Restaurant</button>
    </router-link>
    <router-link  to="/createmenu">Créer un menu</router-link>
  </div>

<!--     <router-link to='/'>Home</router-link> |
    <router-link to='/account'>Account</router-link> |
    <router-link to='/delivery'>Delivery</router-link> |
    <router-link to='/sponsorship'>Sponsorship</router-link> |
    <router-link to='/notification'>Notification</router-link> |
    <router-link to='/dishes'>Menu</router-link> |
    <router-link to='/statistic'>Statistic</router-link> |
    <router-link to='/dashboard'>Dashboard</router-link> |
    <router-link to='/logs'>Logs</router-link> |
    <router-link to='/research'>Research</router-link> -->
  </div>
</template>

<script lang='ts'>
import { mapGetters } from 'vuex';
import Vue from 'vue';
import axios from 'axios';
import RestoCard from '../components/UI/Home/RestoCard.vue';

export default Vue.extend({
  name: 'Home',

  components: {
    RestoCard,
  },
  data() {
    return {
      restaurants: null,
    };
  },
  computed: {
    ...mapGetters(['getUserRole']),
  },
  methods: {
    async getUserId() {
      if (this.$store.getters.getUser.loginStatus === false) {
        if (this.$route.path !== '/login' && this.$route.path !== '/register') {
          this.$router.push('/login').catch();
        }
      }
      return this.$store.getters.getUser.userId; // Utilisez "userId" au lieu de "user_ID"
    },

    async queryResto() {
      try {
        const { token } = this.$store.getters.getUser;
        const accessToken = localStorage.getItem('accessToken');
        console.log(token, 'token');
        const response = await axios.get('/restaurant', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        console.log(this.$store.getters.getUser.role, 'rôle');
        console.log(response.data, 'responsedata');
        this.restaurants = response.data;
      } catch (error) {
        console.error('An error occurred:', error);
        // Rediriger vers la page de connexion si le token d'accès est invalide ou expiré
        this.$router.push('/login');
      }
    },

  },
  async created() {
    const accessToken = localStorage.getItem('accessToken');
    console.log(accessToken, 'checki');
    if (!accessToken) {
      this.$router.push('/login');
    } else {
      await this.getUserId(); // Attendre la résolution de la méthode getUserId()
      this.queryResto();
    }
  },

});
</script>
