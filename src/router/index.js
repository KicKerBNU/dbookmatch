import { createRouter, createWebHistory } from 'vue-router';
import Login from '../components/auth/Login.vue';
import Signup from '../components/auth/Signup.vue';
import BookRecommendation from '../components/BookRecommendation.vue';
import NavBar from '../components/NavBar.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../components/Home.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/signup',
    name: 'Signup',
    component: Signup
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router; 