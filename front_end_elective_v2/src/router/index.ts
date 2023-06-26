import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import Home from '../views/Home.vue';
import store from '../store/index';
import DeliveryAcceptOrder from '../views/DeliveryAcceptOrder.vue';
import DeliveryAvailableOrders from '../views/DeliveryAvailableOrders.vue';
import DeliveryCurrentOrders from '../views/DeliveryCurrentOrders.vue';
import DeliveryFinishOrder from '../views/DeliveryFinishOrder.vue';
import ClientDashboard from '../views/ClientDashboard.vue';
import RestaurantDashboard from '../views/RestaurantDashboard.vue';
import DeliveryDashboard from '../views/DeliveryDashboard.vue';
import DeliveryMan from '../views/DeliveryMan.vue';

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'Accueil',
    component: Home,
  },
  {
    path: '/account',
    name: 'Compte',
    component: () => import('../views/Account.vue'),
  },
  {
    path: '/createmenu',
    name: 'Créer un menu',
    component: () => import('../views/CreateMenu.vue'),
  },
  { // might wanna delete one of these bc overlapping.
    path: '/delivery',
    name: 'Livraison',
    component: () => import('../views/Delivery.vue'),
  },
  {
    path: '/deliveryman',
    name: 'Mes livraisons',
    component: () => import('../views/DeliveryMan.vue'),
    beforeEnter: (to, from, next) => {
      const requiresDeliveryRole = to.meta?.requiresDeliveryRole;
      const user = store.state.user || {};

      const isDeliveryMan = user && user.role === 'delivery';

      if (requiresDeliveryRole
         && (!store.getters.isAuthenticated
         || !isDeliveryMan)) {
        next('/login');
      } else {
        next();
      }
    },

  },
  {
    path: '/register',
    name: 'Inscription',
    component: () => import('../views/Register.vue'),
  },
  {
    path: '/dishes',
    name: 'Plats',
    component: () => import('../views/Dishes.vue'),
  },
  {
    path: '/menu/:id?',
    name: 'Menu',
    component: () => import('../views/Dishes.vue'),
  },
  {
    path: '/order',
    name: 'Commande',
    component: () => import('../views/Dishes.vue'),
  },
  {
    path: '/order-history',
    name: 'Commandes Terminées',
    component: () => import('../views/Dishes.vue'),
  },
  {
    path: '/dashboard',
    name: 'Tableau de bord',
    component: () => import('../views/Dashboard.vue'),
  },
  {
    path: '/cart',
    name: 'Panier',
    component: () => import('../views/Cart.vue'),
  },
  {
    path: '/login',
    name: 'Connexion',
    component: () => import('../views/Login.vue'),
  },
  {
    path: '/delivery/orders/available',
    name: 'DeliveryAvailableOrders',
    component: DeliveryAvailableOrders,
    meta: {
      requiresDeliveryRole: true,
    },
  },
  {
    path: '/delivery/orders/current',
    name: 'DeliveryCurrentOrders',
    component: DeliveryCurrentOrders,
    meta: {
      requiresDeliveryRole: true,
    },
  },
  {
    path: '/delivery/orders/:orderId/accept',
    name: 'DeliveryAcceptOrder',
    component: DeliveryAcceptOrder,
    meta: {
      requiresDeliveryRole: true,
    },
  },
  {
    path: '/delivery/orders/:orderId/finish',
    name: 'DeliveryFinishOrder',
    component: DeliveryFinishOrder,
    meta: {
      requiresDeliveryRole: true,
    },
  },
  {
    path: '/client',
    component: ClientDashboard,
    meta: {
      requiresAuth: true,
      role: 'client',
    },
  },
  {
    path: '/restaurateur',
    component: RestaurantDashboard,
    meta: {
      requiresAuth: true,
      role: 3,
    },
  },
  {
    path: '/delivery',
    component: DeliveryDashboard,
    meta: {
      requiresAuth: true,
      role: 'delivery',
    },
  },
  {
    path: '/restaurant/:id/menus',
    name: 'Menus du restaurant',
    component: () => import('../views/RestaurantDashboard.vue'),
    meta: {
      requiresAuth: true,
      role: 'restaurateur',
    },
  },
];

const router = new VueRouter({
  routes,
  mode: 'history',
});
router.beforeEach((to, from, next) => {
  const requiresAuth = to.meta?.requiresAuth;
  const role = to.meta?.role;

  if (requiresAuth) {
    const userRole = store.getters.getUserRole; // get role from store

    if (userRole !== role) {
      // Redirigez l'utilisateur vers une page d'erreur d'autorisation ou une vue par défaut
      next('/error'); // Exemple de redirection vers une page d'erreur
    } else {
      next(); // L'utilisateur a le rôle requis, continuez vers la vue demandée
    }
  } else {
    next(); // La route ne nécessite pas d'authentification, continuez vers la vue demandée
  }
});

export default router;
