<template>
    <div>
      <h2>Create Restaurant</h2>
      <form @submit.prevent="createRestaurant">
        <div>
          <label for="name">Name</label>
          <input type="text" id="name" v-model="restaurantData.name" required>
        </div>
        <div>
          <label for="address">Address</label>
          <input type="text" id="address" v-model="restaurantData.address" required>
        </div>
        <div>
          <label for="phone">Phone</label>
          <input type="text" id="phone" v-model="restaurantData.phone" required>
        </div>
        <button type="submit">Create</button>
      </form>
    </div>
  </template>

<script>
export default {
  data() {
    return {
      restaurantData: {
        name: '',
        address: '',
        phone: '',
      },
    };
  },
  methods: {
    createRestaurant() {
      // Call the API to create a new restaurant
      // Use this.restaurantData to send the data to the API endpoint
      // Include the user ID of the logged-in user in the request payload
      // Handle the response as needed (e.g., display a success message)
    },
  },
};
</script>
