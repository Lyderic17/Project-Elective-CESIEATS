import Vue from 'vue';
import Vuex from 'vuex';
import auth from './auth';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: {
      loginStatus: false,
      user_ID: '',
      token: '',
      refresh: '',
      role: '',
    },
    basket: [],
  },
  mutations: {
    SET_AUTH_USER(state, user) {
      state.user = {
        loginStatus: true,
        user_ID: user.user_ID,
        token: user.token,
        refresh: user.refresh,
        role: user.role,
      };
    },
    SET_BASKET(state, itemId) {
      state.basket = itemId;
    },
    RESET_USER(state) {
      state.user = {
        loginStatus: false,
        user_ID: '',
        token: '',
        refresh: '',
        role: '',
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
    userId: (state) => state.user.user_ID,
    userRole: (state) => state.user.role,
  },
});
