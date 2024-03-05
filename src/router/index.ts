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
import { useCommonStore } from '@/stores/CommonStore';

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
  meta: { toTop: true, smoothScroll: true, requiresAuth: true },
};
const AccountRoute: RouteRecordRaw = {
  path: '/account',
  name: RouteName.AccountShow,
  component: () => import('@/pages/UserShow.vue'),
  meta: { toTop: true, smoothScroll: true, requiresAuth: true },
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
    const threadMatch = getThreadById(to.params.id as string);
    console.log('ThreadShow > beforeEnter > threadMatch', threadMatch);

    //if positive, contine
    if (threadMatch?.id !== '') {
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
const ThreadEditRoute: RouteRecordRaw = {
  path: '/thread/:id/edit',
  name: RouteName.ThreadEdit,
  component: () => import('@/pages/ThreadEdit.vue'),
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
const UserRegisterRoute: RouteRecordRaw = {
  path: '/register',
  name: RouteName.UserRegister,
  component: () => import('@/pages/UserRegister.vue'),
};
const UserLoginRoute: RouteRecordRaw = {
  path: '/login',
  name: RouteName.UserLogin,
  component: () => import('@/pages/UserLogin.vue'),
};

const { logoutUser } = useUserStore(pinia);
const { notifyAppIsReady } = useCommonStore(pinia);
const UserLogoutRoute: RouteRecordRaw = {
  path: '/logout',
  name: RouteName.UserLogout,
  redirect: '',
  beforeEnter: async (_to, _from, next) => {
    await logoutUser();
    notifyAppIsReady();
    next({
      name: RouteName.TheHome,
    });
  },
};
const NotAuthorizedRoute: RouteRecordRaw = {
  path: '/unauthorized',
  name: RouteName.NotAuthorized,
  component: () => import('@/pages/NotAuthorized.vue'),
};
const NotFoundRoute: RouteRecordRaw = {
  path: '/:patchMatch(.*)*',
  name: RouteName.NotFound,
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
    ThreadEditRoute,
    UserRegisterRoute,
    UserLoginRoute,
    UserLogoutRoute,
    NotAuthorizedRoute,
    NotFoundRoute,
  ],
  scrollBehavior: scrollBehaviorGuard,
};

const router: Router = createRouter(routerOptions);

router.beforeEach(async (to, _from) => {
  console.log('beforeEach global guard > to.name', to.name);
  console.log('beforeEach global guard > to.meta', to.meta);

  if (to.meta.requiresAuth) {
    //TODO : implement auth guard
    //verify auth user exists
    const authUserId = await useUserStore().fetchAuthUser();
    console.log('beforeEach global guard > authUserId', authUserId);

    if (!authUserId) {
      return {
        name: RouteName.NotAuthorized,
        query: to.query,
        hash: to.hash,
      };
    }
    //continue since user is authorized
  }
});
export default router;
