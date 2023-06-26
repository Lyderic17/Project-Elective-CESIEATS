<template>
  <v-row justify='center' style='margin: 80px'>
    <v-col cols='12' sm='8'>
      <v-form ref='form' lazy-validation>
        <v-card>
          <v-card-title class='cyan darken-1'>
            <span class='text-h5 white--text'>
              <v-text-field
                dark
                label='Nom du Menu'
                v-model='new_menu_name'
                required
                :rules='otherRules'
                class='text-h5'
              ></v-text-field>
              <v-text-field
                dark
                label="path de l'image"
                v-model='new_image_path'
                class='text-h5'
                :rules='otherRules'
                required
              ></v-text-field>
            </span>
            <v-spacer></v-spacer>
          </v-card-title>

          <v-list>
            <v-list-item>
              <v-list-item-action>
                <v-icon>mdi-phone</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-text-field
                  label='Element 1'
                  v-model='new_element1'
                  required
                  :rules='otherRules'
                ></v-text-field>
              </v-list-item-content>
            </v-list-item>

            <v-list-item>
              <v-list-item-action>
                <v-icon>mdi-phone</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-text-field
                  label='Element 2'
                  v-model='new_element2'
                  required
                  :rules='otherRules'
                ></v-text-field>
              </v-list-item-content>
            </v-list-item>

            <v-list-item>
              <v-list-item-action>
                <v-icon>mdi-phone</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-text-field
                  label='Element 3'
                  v-model='new_element3'
                  required
                  :rules='otherRules'
                ></v-text-field>
              </v-list-item-content>
            </v-list-item>

            <v-list-item>
              <v-list-item-action>
                <v-icon>mdi-phone</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-text-field
                  label='prix'
                  v-model='new_price'
                  required
                  :rules='otherRules'
                ></v-text-field>
              </v-list-item-content>
            </v-list-item>
          </v-list>
          <div class='d-flex justify-space-around' style='padding-bottom: 15px'>
            <v-btn outlined rounded text @click='validate()'> Valider </v-btn>
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
  components: {},
  computed: {
    ...mapGetters(['getUserRole']),
  },
  data() {
    return {
      new_menu_name: null,
      new_image_path: null,
      new_element1: null,
      new_element2: null,
      new_element3: null,
      new_price: null,
      otherRules: [],
    };
  },
  methods: {
    async createMenu() {
      try {
        const menuData = {
          name: this.new_menu_name,
          image: {
            url: this.new_image_path,
            alt: 'Menu Image',
          },
          elements: [this.new_element1, this.new_element2, this.new_element3],
          price: parseFloat(this.new_price),
        };

        const accessToken = localStorage.getItem('accessToken'); // Récupérer le jeton d'accès depuis le localStorage ou d'une autre manière appropriée
        console.log(accessToken, 'accessToken RESTAURATEUR');
        const response = await axios.post('/menu', menuData, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        console.log(response.data.message); // Affiche "Menu created successfully"

        // Effectuez les actions nécessaires après la création du plat

        // Réinitialisez les champs du formulaire
        this.new_menu_name = null;
        this.new_image_path = null;
        this.new_element1 = null;
        this.new_element2 = null;
        this.new_element3 = null;
        this.new_price = null;
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
      // Vérifiez les champs du formulaire avant d'appeler createMenu
      if (
        this.new_menu_name != null
        && this.new_image_path != null
        && this.new_element1 != null
        && this.new_price != null
      ) {
        this.createMenu();
      }
    },
  },
  beforeMount() {
    console.Log(this.$store.getters.getUser.getUserRole, 'role restauman');
    const user = this.$store.getters.getUser.getUserRole;
    const isRestaurateur = user === '3'; // Vérifiez si l'utilisateur a le rôle de restaurateur

    if (!isRestaurateur) {
      // Redirigez l'utilisateur vers une autre page s'il n'est pas un restaurateur
      this.redirect('/access-denied');
    }
  },
})
export default class CreateMenu extends Vue {}
</script>
