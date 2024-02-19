import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw, Router, RouterOptions } from 'vue-router';
import AppHome from '@/pages/AppHome.vue';
import pinia from '@/stores/pinia';
import { useThreadStore } from '@/stores/ThreadStore';
/**
 * Defines the Home page route
 */
const HomeRoute: RouteRecordRaw = {
  path: '/',
  name: 'TheHome',
  component: AppHome,
};
/**
 * Defines the Signle Category page route
 */
const CategoryShowRoute: RouteRecordRaw = {
  path: '/category/:id',
  name: 'CategoryShow',
  component: () => import('@/pages/CategoryShow.vue'),
  props: true,
};
/**
 * Defines the Signle Forum page route
 */
const ForumShowRoute: RouteRecordRaw = {
  path: '/forum/:id',
  name: 'ForumShow',
  component: () => import('@/pages/ForumShow.vue'),
  props: true,
};
/**
 * Defines the Signle Thread page route
 */
const { getThreadById } = useThreadStore(pinia);
const ThreadShowRoute: RouteRecordRaw = {
  path: '/thread/:id',
  name: 'ThreadShow',
  component: () => import('@/pages/ThreadShow.vue'),
  props: true,
  beforeEnter: (to, _from, next) => {
    //does the thread exists?
    const threadExists = getThreadById(to.params.id as string);
    //if positive, contine
    if (threadExists) {
      return next();
    }
    //else redirect to not found
    //next({ name: "NotFound" }); // <-- redirect with URL change
    next({
      name: 'NotFound',
      params: { patchMatch: to.path.substring(1).split('/') }, // <-- preserve the requested URL while loading the PageNotFound component.
      query: to.query,
      hash: to.hash,
    });
  },
};
/**
 * Defines the NotFound route
 */
const NotFoundRoute: RouteRecordRaw = {
  path: '/:patchMatch(.*)*',
  name: 'PageNotFound',
  component: () => import('@/pages/NotFound.vue'),
};
/**
 * Defines the RouterOptions
 */
const routerOptions: RouterOptions = {
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    HomeRoute,
    CategoryShowRoute,
    ForumShowRoute,
    ThreadShowRoute,
    NotFoundRoute,
  ],
};
const router: Router = createRouter(routerOptions);

export default router;
