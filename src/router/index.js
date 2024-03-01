import { createRouter, createWebHistory } from "vue-router";
import { useRouteName } from "@/helpers/routeNameEnum";
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
    beforeEnter: async (to, from, next) => {
      //TODO : implement auth guard
      //verify auht user exists
      const authUser = await store.dispatch("fetchAuthUser");
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
    beforeEnter: async (to, from, next) => {
      //TODO : implement auth guard
      //verify auth user exists
      const authUser = await store.dispatch("fetchAuthUser");
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
    beforeEnter: async (to, from, next) => {
      //does the thread exists?
      const exists = await store.dispatch("fetchUser", { id: to.params.id });
      console.log("beforeEnter > /user/:id", exists, to.params.id);
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
    beforeEnter: async (to, from, next) => {
      const exists = await store.dispatch("fetchCategory", {
        id: to.params.id,
      });
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
    beforeEnter: async (to, from, next) => {
      //console.log("beforeEnter > /forum/:id > id", to.params.id);
      const exists = await store.dispatch("fetchForum", { id: to.params.id });
      //console.log("beforeEnter > /forum/:id", exists);
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
    beforeEnter: async (to, from, next) => {
      const exists = await store.dispatch("fetchThread", { id: to.params.id });
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
    beforeEnter: async (to, from, next) => {
      const exists = await store.dispatch("fetchForum", {
        id: to.params.forumId,
      });
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
  //Thread Edit route
  {
    path: "/thread/:id/edit",
    name: RouteName.ThreadEdit,
    component: () => import("@/pages/ThreadEdit.vue"),
    props: true,
    beforeEnter: async (to, from, next) => {
      const exists = await store.dispatch("fetchThread", { id: to.params.id });
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
  //Register form route
  {
    path: "/register",
    name: RouteName.UserRegister,
    component: () => import("@/pages/UserRegister.vue"),
  },
  //Register form route
  {
    path: "/login",
    name: RouteName.UserLogin,
    component: () => import("@/pages/UserLogin.vue"),
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

const router = createRouter({
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

router.beforeEach(async () => {
  store.dispatch("runAndResetFirestoreUnsubs");
  await store.dispatch("fetchAuthUser");
  //this.$store.dispatch("notifyAppIsReady");
  store.dispatch("resetAppIsReady");
});

export default router;
