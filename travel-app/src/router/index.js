import { createRouter, createWebHistory } from 'vue-router';
import routesNames from './routesNames';
('@/router/routesNames');
import HomeVue from '@/views/Home.vue';
import NotFoundVue from '@/views/NotFound.vue';

import useSourceData from '@/composables/useSourceData';

const { sourceData } = useSourceData();

const routes = [
  //routes go here
  { path: '/', name: 'home', component: HomeVue },
  {
    path: '/destination-details/:id/:slug',
    name: routesNames.destinationShow,
    component: () => import('@/views/DestinationShow.vue'),
    props: (route) => ({ id: parseInt(route.params.id) }),
    beforeEnter(to, from) {
      //to is the destination route
      //from is the origin route
      //so we want to check the data contains the element matching route.params.id
      const exists = sourceData.destinations.find(
        (element) => element.id === parseInt(to.params.id),
      );

      if (!exists)
        return {
          name: 'notfound',
          //allows keeping the URL intact while rendering a different page
          params: { pathMatch: to.path.split('/').slice(1) },
          query: to.query,
          hash: to.hash,
        };
    },
    children: [
      {
        path: ':experienceSlug',
        name: 'experience-details',
        component: () => import('@/views/ExperienceShow.vue'),
        props: (route) => ({
          id: parseInt(route.params.id),
          experienceSlug: route.params.experienceSlug,
        }),
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'notfound',
    component: NotFoundVue,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    return (
      savedPosition ||
      new Promise((resolve) => {
        setTimeout(() => resolve({ top: 0, behavior: 'smooth' }), 300);
      })
    );
  },
});

export default router;
