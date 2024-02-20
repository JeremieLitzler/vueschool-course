import { createRouter, createWebHistory } from 'vue-router';
import type {
  RouteRecordRaw,
  Router,
  RouterOptions,
  RouterScrollBehavior,
} from 'vue-router';
import AppHome from '@/pages/AppHome.vue';
import pinia from '@/stores/pinia';
import { useThreadStore } from '@/stores/ThreadStore';
import { useUserStore } from '@/stores/UserStore';
import { RouteName } from '@/enums/RouteName';

const HomeRoute: RouteRecordRaw = {
  path: '/',
  name: RouteName.TheHome,
  component: AppHome,
};
const AccountEditRoute: RouteRecordRaw = {
  path: '/account/edit',
  name: RouteName.AccountEdit,
  component: () => import('@/pages/UserShow.vue'),
  props: { edit: true },
  meta: { toTop: true, smoothScroll: true },
  beforeEnter: (to, _from, next) => {
    //TODO : implement auth guard
    //verify auht user exists
    const { getAuthUser } = useUserStore();
    if (!getAuthUser()) {
      return next({
        name: RouteName.NotAuthorized,
        params: { patchMatch: to.path.substring(1).split('/') }, // <-- preserve the requested URL while loading the NotFound component.
        query: to.query,
        hash: to.hash,
      });
    }
    //continue since user is authorized
    next();
  },
};
const AccountRoute: RouteRecordRaw = {
  path: '/account',
  name: RouteName.AccountShow,
  component: () => import('@/pages/UserShow.vue'),
  meta: { toTop: true, smoothScroll: true },
  beforeEnter: (to, _from, next) => {
    //TODO : implement auth guard
    //verify auht user exists
    const { getAuthUser } = useUserStore();
    if (!getAuthUser()) {
      return next({
        name: RouteName.NotAuthorized,
        params: { patchMatch: to.path.substring(1).split('/') }, // <-- preserve the requested URL while loading the NotFound component.
        query: to.query,
        hash: to.hash,
      });
    }
    //continue since user is authorized
    next();
  },
};
const UserShowRoute: RouteRecordRaw = {
  path: '/user/:id',
  name: RouteName.UserShow,
  component: () => import('@/pages/UserShow.vue'),
  props: true,
};
const CategoryShowRoute: RouteRecordRaw = {
  path: '/category/:id',
  name: RouteName.CategoryShow,
  component: () => import('@/pages/CategoryShow.vue'),
  props: true,
};
const ForumShowRoute: RouteRecordRaw = {
  path: '/forum/:id',
  name: RouteName.ForumShow,
  component: () => import('@/pages/ForumShow.vue'),
  props: true,
};
const { getThreadById } = useThreadStore(pinia);
const ThreadShowRoute: RouteRecordRaw = {
  path: '/thread/:id',
  name: RouteName.ThreadShow,
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
      name: RouteName.NotFound,
      params: { patchMatch: to.path.substring(1).split('/') }, // <-- preserve the requested URL while loading the PageNotFound component.
      query: to.query,
      hash: to.hash,
    });
  },
};
const ThreadCreateRoute: RouteRecordRaw = {
  path: '/forum/:forumid/thread/create',
  name: RouteName.ThreadCreate,
  component: () => import('@/pages/ThreadCreate.vue'),
  props: true,
};
const NotAuthorizedRoute: RouteRecordRaw = {
  path: '/unauthorized',
  name: 'NotAuthorized',
  component: () => import('@/pages/NotAuthorized.vue'),
};
const NotFoundRoute: RouteRecordRaw = {
  path: '/:patchMatch(.*)*',
  name: 'PageNotFound',
  component: () => import('@/pages/NotFound.vue'),
};
/**
 * Defines the "scroll to top behavior"
 * @param to The destination route
 * @returns A promise
 */
const scrollBehaviorGuard: RouterScrollBehavior = (to) => {
  const scrollBehavior:
    | { top?: number; behavior?: ScrollBehavior }
    | undefined = {};

  if (to.meta.toTop) scrollBehavior.top = 0;
  if (to.meta.smoothScroll) scrollBehavior.behavior = 'smooth';

  return new Promise((resolve) => {
    setTimeout(() => resolve(scrollBehavior), 500);
  });
};

const routerOptions: RouterOptions = {
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    HomeRoute,
    AccountEditRoute,
    AccountRoute,
    UserShowRoute,
    CategoryShowRoute,
    ForumShowRoute,
    ThreadShowRoute,
    ThreadCreateRoute,
    NotAuthorizedRoute,
    NotFoundRoute,
  ],
  scrollBehavior: scrollBehaviorGuard,
};

const router: Router = createRouter(routerOptions);

export default router;
