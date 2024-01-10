import { createRouter, createWebHistory } from 'vue-router';

import HomeVue from '@/views/Home.vue';
import AboutVue from '@/views/About.vue';
import BrazilVue from '@/views/Brazil.vue';
import PanamaVue from '@/views/Panama.vue';
import JamaicaVue from '@/views/Jamaica.vue';
import HawaiiVue from '@/views/Hawaii.vue';

const routes = [
  //routes go here
  { path: '/', name: 'home', component: HomeVue },
  { path: '/about', name: 'about', component: AboutVue },
  { path: '/brazil', name: 'brazil', component: BrazilVue },
  { path: '/panama', name: 'panama', component: PanamaVue },
  { path: '/jamaica', name: 'jamaica', component: JamaicaVue },
  { path: '/hawaii', name: 'hawaii', component: HawaiiVue },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
