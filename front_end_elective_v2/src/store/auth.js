// store/auth.js

import axios from 'axios';

export default {
  state: {
    user: null,
    restaurant_ID: null,
  },
  mutations: {
    SET_AUTH_USER(state, user) {
      state.user = user;
    },
    SET_RESTAURANT_ID(state, restaurantId) {
      state.restaurant_ID = restaurantId;
    },
  },
  actions: {
    async login({ commit, dispatch }, credentials) {
      try {
        const response = await axios.post('/login', credentials);
        const { accessToken, refreshToken, user } = response.data;

        // Stockez le jeton d'accès et le jeton de rafraîchissement dans le stockage local
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;

        // Ajoutez les tokens et le rôle à l'objet user
        user.token = accessToken;
        user.refresh = refreshToken;

        // Utilisez la mutation SET_AUTH_USER pour mettre à jour le state de l'utilisateur
        commit('SET_AUTH_USER', user);
      } catch (error) {
        // Gérez les erreurs de connexion
        console.error(error);
        // Réinitialisez l'utilisateur dans le state de l'authentification
        commit('SET_AUTH_USER', null);
      }
    },

    logout({ commit }) {
      // Effectuer la déconnexion de l'utilisateur
      commit('SET_AUTH_USER', null);
    },
  },
  getters: {
    getUserRole(state) {
      return state.user ? state.user.role : null;
    },
    getUserId(state) {
      return state.user ? state.user.user_ID : null;
    },
    hasPermission: (state) => (permission) => {
      // Vérifier si l'utilisateur a la permission spécifiée
      const userRole = state.user ? state.user.role : null;
      // Logique pour vérifier les autorisations en fonction du rôle
      // Retourner true ou false en fonction de la vérification
    },
  },
};
