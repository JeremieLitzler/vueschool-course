import { createRouter, createWebHistory } from 'vue-router';
import type {
  RouteRecordRaw,
  Router,
  RouterOptions,
  RouterScrollBehavior,
} from 'vue-router';
import AppHome from '@/pages/AppHome.vue';
import pinia from '@/stores/pinia';
import { useCommonStore } from '@/stores/CommonStore';
import { useUserStore } from '@/stores/UserStore';
import { useThreadStore } from '@/stores/ThreadStore';
import { RouteName } from '@/enums/RouteName';
import { RoutePath } from '@/enums/RoutePath';
import { useForumStore } from '@/stores/ForumStore';
import objectHelper from '@/helpers/objectHelper';
import { useCategoryStore } from '@/stores/CategoryStore';

const HomeRoute: RouteRecordRaw = {
  path: '/',
  name: RouteName.TheHome,
  component: AppHome,
};
const AccountEditRoute: RouteRecordRaw = {
  path: RoutePath.AccountEdit,
  name: RouteName.AccountEdit,
  component: () => import('@/pages/UserShow.vue'),
  props: { edit: true },
  meta: { toTop: true, smoothScroll: true, requiresAuth: true },
};
const AccountRoute: RouteRecordRaw = {
  path: RoutePath.AccountShow,
  name: RouteName.AccountShow,
  component: () => import('@/pages/UserShow.vue'),
  meta: { toTop: true, smoothScroll: true, requiresAuth: true },
};

const { fetchUser } = useUserStore(pinia);
const UserShowRoute: RouteRecordRaw = {
  path: RoutePath.UserShow,
  name: RouteName.UserShow,
  component: () => import('@/pages/UserShow.vue'),
  props: true,
  beforeEnter: async (to, _from, next) => {
    const match = await fetchUser(to.params.id as string);
    if (objectHelper().propExistsInObject(match, 'id')) {
      return next();
    }
    next({
      name: RouteName.NotFound,
      params: { patchMatch: to.path.substring(1).split('/') }, // <-- preserve the requested URL while loading the PageNotFound component.
      query: to.query,
      hash: to.hash,
    });
  },
};

const { fetchCategory } = useCategoryStore(pinia);
const CategoryShowRoute: RouteRecordRaw = {
  path: RoutePath.CategoryShow,
  name: RouteName.CategoryShow,
  component: () => import('@/pages/CategoryShow.vue'),
  props: true,
  beforeEnter: async (to, _from, next) => {
    const match = await fetchCategory(to.params.id as string);
    if (objectHelper().propExistsInObject(match, 'id')) {
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

const { fetchForum } = useForumStore(pinia);
const ForumShowRoute: RouteRecordRaw = {
  path: RoutePath.ForumShow,
  name: RouteName.ForumShow,
  component: () => import('@/pages/ForumShow.vue'),
  props: true,
  beforeEnter: async (to, _from, next) => {
    const match = await fetchForum(to.params.id as string);
    if (objectHelper().propExistsInObject(match, 'id')) {
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
const { fetchThread } = useThreadStore(pinia);
const ThreadShowRoute: RouteRecordRaw = {
  path: RoutePath.ThreadShow,
  name: RouteName.ThreadShow,
  component: () => import('@/pages/ThreadShow.vue'),
  props: true,
  meta: { toTop: true, smoothScroll: true },
  beforeEnter: async (to, _from, next) => {
    const match = await fetchThread(to.params.id as string);
    if (objectHelper().propExistsInObject(match, 'id')) {
      return next();
    }
    next({
      name: RouteName.NotFound,
      params: { patchMatch: to.path.substring(1).split('/') }, // <-- preserve the requested URL while loading the PageNotFound component.
      query: to.query,
      hash: to.hash,
    });
  },
};
const ThreadCreateRoute: RouteRecordRaw = {
  path: RoutePath.ThreadCreate,
  name: RouteName.ThreadCreate,
  component: () => import('@/pages/ThreadCreate.vue'),
  props: true,
  meta: { requiresAuth: true },
};
const ThreadEditRoute: RouteRecordRaw = {
  path: RoutePath.ThreadEdit,
  name: RouteName.ThreadEdit,
  component: () => import('@/pages/ThreadEdit.vue'),
  props: true,
  meta: { requiresAuth: true },
  beforeEnter: async (to, _from, next) => {
    //does the thread exists?
    const threadExists = await fetchThread(to.params.id as string);
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
  path: RoutePath.UserRegister,
  name: RouteName.UserRegister,
  component: () => import('@/pages/UserRegister.vue'),
  meta: { requiresGuest: true },
};
const UserLoginRoute: RouteRecordRaw = {
  path: RoutePath.UserLogin,
  name: RouteName.UserLogin,
  component: () => import('@/pages/UserLogin.vue'),
  meta: { requiresGuest: true },
};

const { logoutUser } = useUserStore(pinia);
const { notifyAppIsReady } = useCommonStore(pinia);
const UserLogoutRoute: RouteRecordRaw = {
  path: RoutePath.UserLogout,
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
  path: RoutePath.NotAuthorized,
  name: RouteName.NotAuthorized,
  component: () => import('@/pages/NotAuthorized.vue'),
};
const NotFoundRoute: RouteRecordRaw = {
  path: RoutePath.NotFound,
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
  await useUserStore().initAuthentification();
  useCommonStore().runAllSnapshotUnsubscribes();
  useCommonStore().resetAsyncUiElements();

  if (to.meta.requiresAuth && !useUserStore().authId) {
    return {
      name: RouteName.UserLogin,
      query: { redirectTo: to.fullPath },
      hash: to.hash,
    };
    //continue since user is authorized
  }
  if (to.meta.requiresGuest && useUserStore().authId) {
    return { name: RouteName.TheHome };
  }
});
export default router;
