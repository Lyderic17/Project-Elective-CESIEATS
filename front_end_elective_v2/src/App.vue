<template>
  <v-app>
    <HomeBar/>
  </v-app>
</template>

<script lang='ts'>
import Vue from 'vue';
import HomeBar from './components/UI/HomeBar/HomeBar.vue';

export default Vue.extend({
  name: 'App',
  components: {
    HomeBar,
  },
  data: () => ({
    //
  }),
});
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #333333;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #333333;
}

nav a.router-link-exact-active {
  color: #4CAF60;
}

*::selection {
  background-color: #A5D6AF;
  color: white;
}

.highlighted-text::selection {
  color: #333333;
}
</style>
