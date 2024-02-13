import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw, Router, RouterOptions } from 'vue-router';
import PageHome from '../components/PageHome.vue';

const HomeRoute: RouteRecordRaw = {
  path: '/',
  name: 'Home',
  component: PageHome,
};
const ThreadShowRoute: RouteRecordRaw = {
  path: '/thread/show/:id',
  name: 'ThreadShow',
  component: () => import('../components/PageThreadShow.vue'),
  props: true,
};
const PageNotFoundRoute: RouteRecordRaw = {
  path: '/:patchMatch(.*)*',
  name: 'PageNotFound',
  component: () => import('../components/PageNotFound.vue'),
};
const routerOptions: RouterOptions = {
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [HomeRoute, ThreadShowRoute, PageNotFoundRoute],
};
const router: Router = createRouter(routerOptions);

export default router;
