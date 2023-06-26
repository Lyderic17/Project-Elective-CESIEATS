<template>
  <v-row justify="center" style="margin: 80px">
    <v-col cols="12" sm="8">
      <v-form ref="form" lazy-validation>
        <v-card>
          <v-card-title class="cyan darken-1">
            <span class="text-h5 white--text">
              <v-text-field
                dark
                label="Nom"
                v-model="new_name"
                required
                class="text-h5"
              ></v-text-field>
              <v-text-field
                dark
                label="Prénom"
                v-model="new_lastname"
                class="text-h5"
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
                  label="Numéro de téléphone"
                  v-model="new_phoneNumber"
                  required
                  :rules="otherRules"
                ></v-text-field>
              </v-list-item-content>
            </v-list-item>

            <v-list-item>
              <v-list-item-action>
                <v-icon>mdi-email</v-icon>
              </v-list-item-action>

              <v-list-item-content>
                <v-text-field
                  label="Email"
                  :rules="emailRules"
                  v-model="new_email"
                  required
                ></v-text-field>
              </v-list-item-content>
            </v-list-item>

            <v-list-item>
              <v-list-item-action>
                <v-icon>mdi-lock</v-icon>
              </v-list-item-action>

              <v-list-item-content>
                <v-text-field
                  label="Mot de passe"
                  v-model="new_password"
                  :rules="passwordRules"
                  :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
                  :type="show ? 'text' : 'password'"
                  @click:append="show = !show"
                  required
                ></v-text-field>
              </v-list-item-content>
            </v-list-item>

            <v-list-item>
              <v-list-item-action>
                <v-icon>mdi-lock</v-icon>
              </v-list-item-action>

              <v-list-item-content>
                <v-text-field
                  label="Confirmer mot de passe"
                  v-model="new_password_check"
                  :rules="passwordRules"
                  :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
                  :type="show ? 'text' : 'password'"
                  @click:append="show = !show"
                  required
                ></v-text-field>
              </v-list-item-content>
            </v-list-item>

            <v-list-item>
              <v-list-item-action>
                <v-icon>mdi-map-marker</v-icon>
              </v-list-item-action>

              <v-list-item-content>
                <v-text-field
                  label="Adresse"
                  v-model="new_address"
                  :rules="otherRules"
                  required
                ></v-text-field>
              </v-list-item-content>
            </v-list-item>

            <v-list-item>
              <v-list-item-action>
                <v-icon>mdi-account-multiple</v-icon>
              </v-list-item-action>

              <v-list-item-content>
                <v-text-field label="Code parrainage"></v-text-field>
              </v-list-item-content>
            </v-list-item>

            <v-list-item>
              <v-list-item-action>
                <v-icon>mdi-credit-card</v-icon>
              </v-list-item-action>

              <v-list-item-content>
                <v-btn outlined text @click="editCard()">
                  Ajouter une carte
                </v-btn>
              </v-list-item-content>
            </v-list-item>

            <v-list-item>
              <v-list-item-action>
                <v-icon>mdi-account</v-icon>
              </v-list-item-action>

              <v-list-item-content>
                <v-select v-model="new_role" :items="roles" label="Rôle" outlined></v-select>
              </v-list-item-content>
            </v-list-item>
          </v-list>

          <div class="d-flex justify-space-around" style="padding-bottom: 15px">
            <v-btn outlined rounded text @click="validate()">Valider</v-btn>
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
import bcrypt from 'bcryptjs';

axios.defaults.baseURL = 'http://localhost:3000';

@Options({
  components: {},
  data() {
    return {
      show: false,
      new_name: null,
      new_lastname: null,
      new_phoneNumber: null,
      new_email: null,
      new_address: null,
      new_password: null,
      new_password_check: null,
      new_role: null, // Nouvelle propriété pour stocker le rôle
      roles: ['0', '1', '2', '3', '4', '5'], // Options de rôle
      data: null,
      otherRules: [
        (v) => (!!v) || 'Requis',
        (v) => (v && v.length >= 10) || 'Veuiller mettre une donnée valide',
      ],
      passwordRules: [
        (v) => (!!v) || 'Un mot de passe est requis',
        (v) => (v && v.length >= 10) || "Un mot de passe doit étre d'au moins 10 charaters",
      ],
      emailRules: [
        (v) => (!!v) || 'Un E-mail est requis',
        (v) => /.+@.+\..+/.test(v) || "L'e-mail n'est pas vailde",
      ],
    };
  },
  methods: {
    redirect(path) {
      if (this.$route.path !== path) {
        this.$router.push(path).catch();
      }
    },
    async validate() {
      this.$refs.form.validate();
      if (this.new_password != null && this.new_password === this.new_password_check) {
        this.data = {
          username: this.new_name + this.new_lastname,
          usertype: this.new_role,
          email: this.new_email,
          password: await this.cryptPassword(this.new_password),
          firstname: this.new_name,
          lastname: this.new_lastname,
          address: {
            country: 'USA',
            zipcode: '12345',
            city: 'New York City',
            address: this.new_address,
          },
          billing: {
            number: '4242424242424272',
            crypto: '420',
            owner: this.new_name + this.new_lastname,
          },
        };
        // this.new_phoneNumber;
        this.postNewAccount(this.data);
      }
    },
    async cryptPassword(myPlaintextPassword) {
      // bcrypt.hash(myPlaintextPassword, 10).then((hash) => hash);
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(myPlaintextPassword, salt);
      return hash;
    },
    async postNewAccount(data) {
      try {
        const response = await axios.post('/user/', data);
        console.log(response.status);
        if (response.status >= 200 && response.status < 300) {
          this.redirect('/login');
        }
      } catch (error) {
        console.error(error);
      }
    },
  },
})

export default class Account extends Vue {}
</script>
