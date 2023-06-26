<template>
  <div class='login'>
    <div class="login-container">
      <h2>Connexion à Cesi<span class="highlighted-text">Eats</span></h2>
      <form @submit.prevent="login">
        <div class="form-group">
          <label for="email">Email :</label>
          <input type="email" id="email" v-model="new_email" required>
        </div>
        <div class="form-group">
          <label for="password">Mot de passe :</label>
          <input type="password" id="password" v-model="new_password" required>
        </div>
        <button type="submit" @click="validate()">Se connecter</button>
      </form>
    </div>
  </div>
</template>

<script>
import Options from 'vue-class-component';
import Vue from 'vue';
import axios from 'axios';
import bcrypt from 'bcryptjs';

import forgottenPassword from '../components/UI/Login/forgottenPassword.vue';

axios.defaults.baseURL = 'http://localhost:3000';

@Options({
  data() {
    return {
      alert: false,
      show: false,
      know: true,
      new_email: null,
      new_password: null,
      passwordRules: [(v) => !!v || 'Un mot de passe est requis'],
    };
  },
  components: {
    forgottenPassword,
  },
  methods: {
    redirect(path) {
      if (this.$route.path !== path) {
        this.$router.push(path).catch();
      }
    },
    async validate() {
      const d = await axios.post('/login', {
        email: this.new_email,
        password: this.new_password,
      });
      console.log(d);
      if (d.status === 200) {
        this.dataToken = d.data.accessToken;
        localStorage.setItem('accessToken', d.data.accessToken);
        axios.defaults.headers.common.Authorization = `Bearer ${d.data.accessToken}`;
        const response = await axios.get(`/user/one/?email=${this.new_email}`);
        if (response.data.password) {
          const pswv = await bcrypt.compare(this.new_password, response.data.password);
          if (pswv) {
            this.$store.dispatch('fetchProfil', {
              loginStatus: true,
              userId: response.data.id,
              usertype: response.data.usertype,
              token: d.data.accessToken,
              refresh: d.data.refreshToken,
            });
            console.log(this.$store, 'store');
            this.$router.push('/');
          }
        }
      }
    },
    changePassword() {
      this.know = true;
    },
  },
})
export default class Login extends Vue {}
</script>

<style>
body, HTML{
  padding: 0;
  margin: 0;
}

.aaa{
  text-decoration: none;
  margin-left: 20px;
}

.test{
  position: fixed;
  right: 5%;
}

.highlighted-text {
  color: #4CAF50;
}

label {
  display: flex;
  font-weight: bold;
  padding-left: 10px;
}

.login-container {
  max-width: 400px;
  margin: 0 auto;
  margin-top: 30px;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 4px;
  transition: box-shadow 0.3s;
}

.login-container:hover {
  box-shadow: 5px 5px 5px #ccc
}

.form-group {
  margin-bottom: 15px;
}

input[type="email"],
input[type="password"] {
  width: 90%;
  padding: 10px;
  font-size: 16px;
  border-radius: 4px;
  border: 1px solid #ccc;
}

button[type="submit"] {
  display: block;
  width: 100%;
  padding: 10px;
  font-size: 16px;
  font-weight: bold;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>
