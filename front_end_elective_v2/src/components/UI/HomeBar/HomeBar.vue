<template>
  <div class='HomeBar'>
    <v-card class='mx-auto overflow-hidden'>
      <v-app-bar color='white' >
        <v-app-bar-nav-icon @click='drawer = true'></v-app-bar-nav-icon>

        <v-toolbar-title>{{ $route.name }}</v-toolbar-title>
        <v-spacer></v-spacer>

        <v-menu offset-y>
          <template v-slot:activator='{ on, attrs }'>
            <v-btn icon v-bind='attrs' v-on='on'>
              <v-badge color='red' content='3'>
                <v-icon>mdi-bell</v-icon>
              </v-badge>
            </v-btn>
          </template>
          <v-list>
            <v-list-item>
              <v-list-item-title> un truc t'attend </v-list-item-title>
            </v-list-item>
            <v-list-item>
              <v-list-item-title>un autre truc t'attend</v-list-item-title>
            </v-list-item>
            <v-list-item>
              <v-list-item-title>voilà une notif</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>

        <v-btn icon @click='showSearchBar()'>
          <v-icon>mdi-magnify</v-icon>
        </v-btn>
          <v-text-field
            v-show='searchBar'
            single-line
            solo
            @change='search()'
            style='margin-top: 30px'
          >
          </v-text-field>
          <div class='result__div' v-if='result && searchBar'>
            <v-list three-line>
              <router-link :to="'/menu/' + rep.restaurantId"
              v-for='rep in result' :key='rep.restaurantId'>
              <!-- v-for='(rep, index) in result' :key='rep.restaurantId'> -->
                <v-list-item :key='rep.name'>
                  <!-- <v-divider v-if='index != 0'></v-divider><br/> -->
                  <v-list-item-avatar>
                    <v-img :src='rep.image.url'></v-img>
                  </v-list-item-avatar>

                  <v-list-item-content>
                    <v-list-item-title v-html='rep.name'></v-list-item-title>
                    <v-list-item-subtitle
                      v-if='rep.description'
                      v-html='rep.description'
                    ></v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </router-link>
            </v-list>
        </div>

        <v-menu left bottom>
          <template v-slot:activator='{ on, attrs }'>
            <v-btn icon v-bind='attrs' v-on='on'>
              <v-icon>mdi-dots-vertical</v-icon>
            </v-btn>
          </template>

          <v-list>
            <v-list-item
              @click='redirect("/account")'
              v-if='getUserId.loginStatus === true'
            >
              <v-list-item-title>Mon compte</v-list-item-title>
            </v-list-item>
            <v-list-item
              @click='redirect("/login")'
              v-if='getUserId.loginStatus === false'
            >
              <v-list-item-title>Connexion</v-list-item-title>
            </v-list-item>
            <v-list-item
              @click='$store.dispatch("disconect"), redirect("/login")'
              v-if='getUserId.loginStatus === true'
              >
              <v-list-item-title>Deconnexion</v-list-item-title>
            </v-list-item>
            <v-list-item
              @click='redirect("/register")'
              v-if='getUserId.loginStatus === false'
            >
              <v-list-item-title>Inscription</v-list-item-title>
            </v-list-item>
            <v-list-item
              @click='redirect("/dashboard")'
              v-if='this.getUserId.role === 0
              || this.getUserId.role === 1
              || this.getUserId.role === 2'
              >
              <v-list-item-title>Tableau de bord</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-app-bar>

      <v-navigation-drawer v-model='drawer' absolute temporary>
        <v-list nav dense>
          <v-list-item-group
            v-model='group'
            active-class='deep-purple--text text--accent-4'
          >
            <v-list-item @click='redirect("/")'>
              <v-list-item-icon>
                <v-icon>mdi-home</v-icon>
              </v-list-item-icon>
              <v-list-item-title>Accueil</v-list-item-title>
            </v-list-item>

            <v-list-item @click='redirect("/order")'>
              <v-list-item-icon>
                <v-icon>mdi-account</v-icon>
              </v-list-item-icon>
              <v-list-item-title>Commandes</v-list-item-title>
            </v-list-item>

            <v-list-item @click='redirect("/order-history")'>
              <v-list-item-icon>
                <v-icon>mdi-account</v-icon>
              </v-list-item-icon>
              <v-list-item-title>Commandes Terminées</v-list-item-title>
            </v-list-item>

            <v-list-item @click='redirect("/cart")'>
              <v-list-item-icon>
                <v-icon>mdi-basket</v-icon>
              </v-list-item-icon>
              <v-list-item-title>Panier</v-list-item-title>
            </v-list-item>

            <v-list-item
            v-if='this.getUserId.role === 4
            || this.getUserId.role === 0
            || this.getUserId.role === 6'
            @click='redirect("/deliveryman")'>
              <v-list-item-icon>
                <v-icon>mdi-bike-fast</v-icon>
              </v-list-item-icon>
              <v-list-item-title>Mes livraisons</v-list-item-title>
            </v-list-item>

            <v-list-item
            v-if='this.getUserId.role === 3
            || this.getUserId.role === 0
            || this.getUserId.role === 6'
            @click='redirect("/createmenu")'>
              <v-list-item-icon>
                <v-icon>mdi-hamburger</v-icon>
              </v-list-item-icon>
              <v-list-item-title>Créer un menu</v-list-item-title>
            </v-list-item>

            <v-list-item
            v-if='this.getUserId.role === 3
            || this.getUserId.role === 0
            || this.getUserId.role === 6'
            @click='redirect("/createmenu")'>
              <v-list-item-icon>
                <v-icon>mdi-hamburger</v-icon>
              </v-list-item-icon>
              <v-list-item-title>editer un menu</v-list-item-title>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-navigation-drawer>
      <v-main style='min-height: 95vh;'>
        <router-view />
      </v-main>
    </v-card>
  </div>
</template>

<script>
import Options from 'vue-class-component';
import Vue from 'vue';
import axios from 'axios';

@Options({
  components: {},
  data: () => ({
    searchBar: false,
    data: Array,
    result: null,
    drawer: false,
    group: null,
  }),
  methods: {
    redirect(path) {
      if (this.$route.path !== path) {
        this.$router.push(path).catch();
      }
    },
    async search(e) {
      // const response = await axios.get(`/research?match=${this.restoId}`);
      // this.result = response.data;
      this.result = [
        {
          name: 'Istanbul Grill',
          restaurantId: 'istanbul_4242',
          address: '12 rue de la gare, Nanterre 92000',
          status: 'open',
          image: {
            url: 'https://www.telerama.fr/sites/tr_master/files/styles/simplecrop1000/public/fauves13_0.jpg?itok=SAX57ak4',
            name: 'dqz',
          },
          tags: ['kebab', 'grec', 'pas cher'],
          opening: [{ open: '09:04:16+00:00', close: '22:04:16+00:00' }],
          description: 'au kebab du soleil :)',
        },
        {
          name: 'Grace Neo Pizza',
          restaurantId: 'neo_4242',
          address: '24 rue de la port, Marseille 92000',
          status: 'open',
          image: {
            url: 'https://www.lesfilsamaman.com/wp-content/uploads/restaurant-a-orlean-1.jpg',
            name: 'dqz',
          },
          opening: [{ open: '09:04:16+00:00', close: '22:04:16+00:00' }],
          description: "au Pizza d'italie :)",

        },
      ];
    },
    showSearchBar() {
      this.searchBar = !this.searchBar;
    },
  },
  computed: {
    getUserId() {
      if (this.$store.getters.getUser.loginStatus === false) {
        if (this.$route.path !== '/login' && this.$route.path !== '/register') {
          this.$router.push('/login').catch();
        }
      }
      return this.$store.getters.getUser;
    },
  },
})
export default class HomeBar extends Vue {}
</script>

<style scoped>
.result__div {
  z-index: 50000;
  position: relative;
  top: 50%;
  left: 0;
  transform: translate(0, 50%);
}
</style>
