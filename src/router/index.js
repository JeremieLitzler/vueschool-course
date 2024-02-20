import { createRouter, createWebHistory } from "vue-router";
import { useRouteName } from "@/composables/useRouteName";
import store from "@/store";
import TheHome from "@/pages/TheHome.vue";

const { RouteName } = useRouteName();
const routes = [
  {
    path: "/",
    name: RouteName.TheHome,
    component: TheHome,
  },
  //Authenticated edit user profile route
  {
    path: "/account/edit",
    name: RouteName.AccountEdit,
    component: () => import("@/pages/UserShow.vue"),
    props: { edit: true },
    meta: { toTop: true, smoothScroll: true },
    beforeEnter: (to, from, next) => {
      //TODO : implement auth guard
      //verify auht user exists
      const authUser = store.getters.authUser;
      if (!authUser) {
        return next({
          name: RouteName.NotAuthorized,
          params: { patchMatch: to.path.substring(1).split("/") }, // <-- preserve the requested URL while loading the NotFound component.
          query: to.query,
          hash: to.hash,
        });
      }
      //continue since user is authorized
      next();
    },
  },
  //Authenticated user profile route
  {
    path: "/account",
    name: RouteName.AccountShow,
    component: () => import("@/pages/UserShow.vue"),
    props: { edit: false },
    meta: { toTop: true, smoothScroll: true },
    beforeEnter: (to, from, next) => {
      //TODO : implement auth guard
      //verify auht user exists
      const authUser = store.getters.authUser;
      if (!authUser) {
        return next({
          name: RouteName.NotAuthorized,
          params: { patchMatch: to.path.substring(1).split("/") }, // <-- preserve the requested URL while loading the NotFound component.
          query: to.query,
          hash: to.hash,
        });
      }
      //continue since user is authorized
      next();
    },
  },
  //User profile route
  {
    path: "/user/:id",
    name: RouteName.UserShow,
    component: () => import("@/pages/UserShow.vue"),
    props: true,
    beforeEnter: (to, from, next) => {
      //does the thread exists?
      const exists = store.state.users.find((item) => item.id === to.params.id);
      //if positive, contine
      //see https://stackoverflow.com/a/62426354
      //threadExists ?? next()
      if (exists) {
        return next();
      }
      //else redirect to not found
      //next({ name: RouteName.NotFound }); // <-- redirect with URL change
      next({
        name: RouteName.NotFound,
        params: { patchMatch: to.path.substring(1).split("/") }, // <-- preserve the requested URL while loading the NotFound component.
        query: to.query,
        hash: to.hash,
      });
    },
  },
  //Category route
  {
    path: "/category/:id",
    name: RouteName.CategoryShow,
    component: () => import("@/pages/CategoryShow.vue"),
    props: true,
    beforeEnter: (to, from, next) => {
      //does the thread exists?
      const exists = store.state.categories.find(
        (item) => item.id === to.params.id
      );
      //if positive, contine
      //see https://stackoverflow.com/a/62426354
      //threadExists ?? next()
      if (exists) {
        return next();
      }
      //else redirect to not found
      //next({ name: RouteName.NotFound }); // <-- redirect with URL change
      next({
        name: RouteName.NotFound,
        params: { patchMatch: to.path.substring(1).split("/") }, // <-- preserve the requested URL while loading the NotFound component.
        query: to.query,
        hash: to.hash,
      });
    },
  },
  //Forum route
  {
    path: "/forum/:id",
    name: RouteName.ForumShow,
    component: () => import("@/pages/ForumShow.vue"),
    props: true,
    beforeEnter: (to, from, next) => {
      //does the thread exists?
      const exists = store.state.forums.find(
        (item) => item.id === to.params.id
      );
      //if positive, contine
      //see https://stackoverflow.com/a/62426354
      //threadExists ?? next()
      if (exists) {
        return next();
      }
      //else redirect to not found
      //next({ name: RouteName.NotFound }); // <-- redirect with URL change
      next({
        name: RouteName.NotFound,
        params: { patchMatch: to.path.substring(1).split("/") }, // <-- preserve the requested URL while loading the NotFound component.
        query: to.query,
        hash: to.hash,
      });
    },
  },
  //Thread Show route
  {
    path: "/thread/:id",
    name: RouteName.ThreadShow,
    component: () => import("@/pages/ThreadShow.vue"),
    props: true,
    beforeEnter: (to, from, next) => {
      //does the thread exists?
      const exists = store.state.threads.find(
        (item) => item.id === to.params.id
      );
      //if positive, contine
      //see https://stackoverflow.com/a/62426354
      //threadExists ?? next()
      if (exists) {
        return next();
      }
      //else redirect to not found
      //next({ name: RouteName.NotFound }); // <-- redirect with URL change
      next({
        name: RouteName.NotFound,
        params: { patchMatch: to.path.substring(1).split("/") }, // <-- preserve the requested URL while loading the NotFound component.
        query: to.query,
        hash: to.hash,
      });
    },
  },
  //Thread Create route
  {
    path: "/forum/:forumId/thread/create",
    name: RouteName.ThreadCreate,
    component: () => import("@/pages/ThreadCreate.vue"),
    props: true,
  },
  //Not authorized route
  {
    path: "/unauthorized",
    name: RouteName.NotAuthorized,
    component: () => import("@/pages/NotAuthorized.vue"),
  },
  //No found route
  {
    path: "/:patchMatch(.*)*",
    name: RouteName.NotFound,
    component: () => import("@/pages/NotFound.vue"),
  },
];

export default createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to) {
    //this restore the top position with 300 ms dely to avoid a visual bug since we have a transition active.
    const scroll = {};
    if (to.meta.toTop) scroll.top = 0;
    if (to.meta.smoothScroll) scroll.behavior = "smooth";
    return new Promise((resolve) => {
      setTimeout(() => resolve(scroll), 500);
    });
  },
});
