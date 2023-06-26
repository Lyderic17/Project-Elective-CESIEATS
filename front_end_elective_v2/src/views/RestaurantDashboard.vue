<template>
    <div>
      <h1>Menus du restaurant</h1>
      <div v-if="menus.length > 0">
        <!-- Affichage des menus -->
        <ul>
          <li v-for="menu in menus" :key="menu._id">
            <h3>{{ menu.name }}</h3>
            <p>{{ menu.price }}</p>
            <button @click="deleteMenu(menu._id)">Supprimer</button>
            <button @click="editMenu(menu._id)">Modifier</button>
          </li>
        </ul>
      </div>
      <div v-else>
        <p>Aucun menu disponible.</p>
      </div>
    </div>
  </template>

<script>
import { mapGetters, mapMutations } from 'vuex';
import axios from 'axios';

export default {
  data() {
    return {
      menus: [], // Tableau pour stocker les menus du restaurant
    };
  },
  mounted() {
    this.fetchMenus(); // Appel à la méthode pour récupérer les menus
    // pendant le chargement du composant
  },
  computed: {
    ...mapGetters(['getUser']),
    restaurantId() {
      return this.getUser.restaurantId;
    },
  },
  methods: {
    ...mapMutations(['setRestaurantId']),
    someMethod() {
      const restaurantId = '123'; // Remplacez par la valeur de restaurantId que vous souhaitez passer
      this.setRestaurantId(restaurantId);
    },
    fetchMenus() {
      console.log(this.restaurantId, 'restauID');
      // Vérifier si l'ID du restaurant est défini
      if (!this.restaurantId) {
        return;
      }

      // Appel à l'API pour récupérer les menus du restaurant
      axios.get(`/restaurant/${this.restaurantId}/menus`)
        .then((response) => {
          this.menus = response.data;
        })
        .catch((error) => {
          console.error(error);
        });
    },
    deleteMenu(menuId) {
      // Méthode pour supprimer un menu
      axios.delete(`/menu/${menuId}`)
        .then(() => {
          this.fetchMenus(); // Rafraîchir la liste des menus après la suppression
        })
        .catch((error) => {
          console.error(error);
        });
    },
    editMenu(menuId) {
      // Méthode pour modifier un menu
    },
  },
  created() {
    this.fetchMenus(); // Appel à la méthode pour récupérer
    // les menus pendant le chargement du composant
  },
};

</script>
