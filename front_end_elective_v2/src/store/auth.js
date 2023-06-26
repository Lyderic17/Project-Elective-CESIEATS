// store/auth.js

import axios from 'axios';

export default {
  state: {
    user: null,
  },
  mutations: {
    SET_AUTH_USER(state, user) {
      state.user = user;
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
        // Appeler l'action fetchProfil pour mettre à jour le state de l'utilisateur
        dispatch('fetchProfil', user);
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
      return state.user ? state.user.usertype : null;
    },
    hasPermission: (state) => (permission) => {
      // Vérifier si l'utilisateur a la permission spécifiée
      const userRole = state.user ? state.user.role : null;
      // Logique pour vérifier les autorisations en fonction du rôle
      // Retourner true ou false en fonction de la vérification
    },
  },
};
