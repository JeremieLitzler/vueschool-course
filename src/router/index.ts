import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw, Router, RouterOptions } from 'vue-router';
import PageHome from '../components/PageHome.vue';
import useThread from '../composables/useThread';
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
  beforeEnter: (to, _from, next) => {
    //does the thread exists?
    const threadExists = useThread().getThreadById(to.params.id as string);
    //if positive, contine
    //see https://stackoverflow.com/a/62426354
    //threadExists ?? next()
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
