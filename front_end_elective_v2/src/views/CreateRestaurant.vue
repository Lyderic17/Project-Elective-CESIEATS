<template>
  <div class="container">
    <h1>Create Restaurant</h1>
    <form @submit.prevent="submitForm">
      <div class="input-group">
        <label for="rest_name">Restaurant Name</label>
        <input id="rest_name" v-model="form.rest_name" type="text" required />
      </div>
      <div class="input-group">
        <label for="address">Address</label>
        <input id="address" v-model="form.address" type="text" required />
      </div>
      <div class="input-group">
        <label for="phone">Phone</label>
        <input id="phone" v-model="form.phone" type="number" required />
      </div>
      <div class="input-group">
        <label for="status">Status</label>
        <input id="status" v-model="form.status" type="checkbox" />
      </div>
      <button type="submit" class="submit-btn" @click="submitForm()">Submit</button>
    </form>
  </div>
</template>

<script>
import axios from 'axios';
import { mapGetters } from 'vuex';

export default {
  data() {
    return {
      form: {
        rest_name: '',
        address: '',
        phone: '',
        status: false,
      },
    };
  },
  computed: {
    ...mapGetters(['userRole']),
  },
  methods: {
    async submitForm() {
      const restaurant = {
        ...this.form,
        status: this.form.status ? 1 : 0,
        owner_ID: this.$store.getters.getUser.user_ID,
        crea_date: new Date(),
      };
      try {
        console.log(this.$store.getters.getUser.user_ID, 'userole');
        const response = await axios.post('/restaurant/create', restaurant); // Postez les données à votre endpoint API
        console.log(response.data); // Vous pouvez afficher la réponse dans la console pour déboguer
      } catch (error) {
        console.error(error);
      }
    },
  },
};
</script>
<style scoped>
.container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  background-color: white;
}

.input-group {
  margin-bottom: 20px;
}

.input-group label {
  display: block;
  margin-bottom: 10px;
}

.input-group input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box;
}

.submit-btn {
  padding: 10px 20px;
  background-color: #007BFF;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>
