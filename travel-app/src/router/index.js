import { createRouter, createWebHistory } from 'vue-router';
import routesNames from './routesNames';
('@/router/routesNames');
import HomeVue from '@/views/Home.vue';

const routes = [
  //routes go here
  { path: '/', name: 'home', component: HomeVue },
  {
    path: '/destination-details/:id/:slug',
    name: routesNames.destinationShow,
    component: () => import('@/views/DestinationShow.vue'),
    props: (route) => ({ id: parseInt(route.params.id) }),
  },
  {
    path: '/experience-details/:id/:slug/:experienceSlug',
    name: 'experience-details',
    component: () => import('@/views/ExperienceShow.vue'),
    props: (route) => ({
      id: parseInt(route.params.id),
      experienceSlug: route.params.experienceSlug,
    }),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
