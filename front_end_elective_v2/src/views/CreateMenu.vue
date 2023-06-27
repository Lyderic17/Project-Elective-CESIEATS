<template>
  <v-row justify="center" style="margin: 80px">
    <v-col cols="12" sm="8">
      <v-form ref="form" lazy-validation>
        <v-card>
          <v-card-title class="cyan darken-1">
            <span class="text-h5 white--text">
              <v-text-field
                dark
                label="Nom du Menu"
                v-model="new_menu_name"
                required
                :rules="otherRules"
                class="text-h5"
              ></v-text-field>
              <v-text-field
                dark
                label="Prix"
                v-model="new_price"
                required
                :rules="otherRules"
                class="text-h5"
              ></v-text-field>
            </span>
            <v-spacer></v-spacer>
          </v-card-title>
          <v-list>
            <v-list-item v-for="(element, index) in elements" :key="index">
              <v-list-item-action>
                <v-icon>mdi-phone</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-text-field
                  :label="`Element ${index + 1}`"
                  v-model="elements[index]"
                  required
                  :rules="otherRules"
                ></v-text-field>
              </v-list-item-content>
            </v-list-item>
          </v-list>
          <div
            class="d-flex justify-space-around"
            style="padding-bottom: 15px"
          >
            <v-btn outlined rounded text @click="addElement()">Ajouter un élément</v-btn>
          </div>
          <div
            class="d-flex justify-space-around"
            style="padding-bottom: 15px"
          >
            <v-btn outlined rounded text @click="createMenu()"> Valider </v-btn>
          </div>
        </v-card>
      </v-form>
    </v-col>
  </v-row>
</template>

<script>
import Options from 'vue-class-component';
import Vue from 'vue';
import axios from 'axios';
import { mapGetters } from 'vuex';

axios.defaults.baseURL = 'http://localhost:3000';

@Options({
  computed: {
    ...mapGetters(['getUser', 'restaurantId']),
  },
  data() {
    return {
      new_menu_name: null,
      new_price: null,
      elements: [],
      otherRules: [],
    };
  },
  methods: {
    async createMenu() {
      console.log(this.getUser, 'tellll');
      try {
        const userData = this.getUser;
        const restaurantData = await axios.get(
          `/restaurant/byUser/${userData.user_ID}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            },
          },
        );
        console.log(restaurantData, 'restaurantDatttaaaaaaaaaaa');
        if (restaurantData.data && restaurantData.data.length > 0) {
          const menuData = {
            restaurant_ID: restaurantData.data[0].restaurant_ID,
            menu_name: this.new_menu_name,
            composition: this.elements.join(', '),
            price: parseFloat(this.new_price),
            status: '',
          };

          const response = await axios.post('/menu/create', menuData, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            },
          });

          console.log(response.data.message, 'EEEEEEEEEEHOH');

          // Réinitialisation des valeurs des champs de texte
          this.new_menu_name = null;
          this.new_price = null;
          this.elements = [];
        } else {
          console.error("L'utilisateur n'a aucun restaurant associé");
        }
      } catch (error) {
        console.error('Error creating menu:', error.response.data.error);
      }
    },

    redirect(path) {
      if (this.$route.path !== path) {
        this.$router.push(path).catch();
      }
    },

    validate() {
      if (
        this.new_menu_name !== null
        && this.new_price !== null
        && this.elements.length > 0
      ) {
        this.createMenu();
      }
    },

    addElement() {
      this.elements.push('');
    },
  },

  beforeMount() {
    const user = this.getUser.role;
    const isRestaurateur = user === '3';

    if (!isRestaurateur) {
      this.redirect('/access-denied');
    }
  },
})
export default class CreateMenu extends Vue {}
</script>
