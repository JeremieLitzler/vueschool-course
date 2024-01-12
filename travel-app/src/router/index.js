import { createRouter, createWebHistory } from 'vue-router';

import HomeVue from '@/views/Home.vue';

const routes = [
  //routes go here
  { path: '/', name: 'home', component: HomeVue },
  {
    path: '/brazil',
    name: 'brazil',
    component: () => import('@/views/Brazil.vue'),
  },
  {
    path: '/panama',
    name: 'panama',
    component: () => import('@/views/Panama.vue'),
  },
  {
    path: '/jamaica',
    name: 'jamaica',
    component: () => import('@/views/Jamaica.vue'),
  },
  {
    path: '/hawaii',
    name: 'hawaii',
    component: () => import('@/views/Hawaii.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
