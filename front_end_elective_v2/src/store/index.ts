import Vue from 'vue';
import Vuex from 'vuex';
import auth from './auth';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: {
      loginStatus: false,
      userId: '',
      token: '',
      refresh: '',
      role: '',
      restaurantId: null,
    },
    basket: [],
  },
  mutations: {
    setRestaurantId(state, restaurantId) {
      state.user.restaurantId = restaurantId;
    },
    SET_AUTH_USER(state, status) {
      state.user = status;
    },
    SET_BASKET(state, itemId) {
      state.basket = itemId;
    },
    RESET_USER(state) {
      state.user = {
        loginStatus: false,
        userId: '',
        token: '',
        refresh: '',
        role: '',
        restaurantId: null,
      };
    },
    RESET_BASKET(state) {
      state.basket = [];
    },
  },
  actions: {
    updateRestaurantId({ commit }, restaurantId) {
      commit('setRestaurantId', restaurantId);
    },
    fetchProfil(context, payload) {
      context.commit('SET_AUTH_USER', payload);
    },
    fetchBasket(context, payload) {
      context.commit('SET_BASKET', payload);
    },
    disconect(context) {
      context.commit('RESET_USER');
    },
    ClearBasket(context) {
      context.commit('RESET_BASKET');
    },
  },
  modules: {
    auth,
  },
  getters: {
    getUser: (state) => state.user,
    getBasket: (state) => state.basket,
    isAuthenticated: (state) => state.user.loginStatus,
    restaurantId: (state) => state.user.restaurantId,
  },
});
