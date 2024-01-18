import routesNames from './routesNames';
('@/router/routesNames');
import useSourceData from '@/composables/useSourceData';

import HomeVue from '@/views/Home.vue';
import NotFoundVue from '@/views/NotFound.vue';

const { sourceData } = useSourceData();

export default [
  //routes go here
  { path: '/', name: 'home', component: HomeVue },
  { path: '/home', redirect: { name: 'home' } },
  {
    path: '/dashboard',
    name: 'dashboard',
    components: {
      default: () => import('@/views/Dashboard.vue'),
      LeftSideBar: () => import('@/components/LeftSideBar.vue'),
    },
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/UserLogin.vue'),
  },
  {
    path: '/invoices',
    name: 'invoices',
    components: {
      default: () => import('@/views/Invoices.vue'),
      LeftSideBar: () => import('@/components/LeftSideBar.vue'),
    },
    meta: {
      requiresAuth: true,
    },
  },
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
