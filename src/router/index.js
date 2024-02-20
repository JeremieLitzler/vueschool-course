import store from "@/store";
import TheHome from "@/pages/TheHome.vue";

export const routes = [
  {
    path: "/",
    name: "TheHome",
    component: TheHome,
  },
  //Authenticated edit user profile route
  {
    path: "/account/edit/:id",
    name: "UserConnectedShow",
    component: () => import("@/pages/UserShow.vue"),
    props: true,
    beforeEnter: (to, from, next) => {
      //TODO : implement auth guard
      next();
    },
  },
  //Authenticated user profile route
  {
    path: "/account",
    name: "UserConnectedShow",
    component: () => import("@/pages/UserShow.vue"),
    props: true,
    beforeEnter: (to, from, next) => {
      //TODO : implement auth guard
      const authUser = store.getters.authUser;
      if (!authUser) {
        return next({
          name: "NotAuthorized",
          params: { patchMatch: to.path.substring(1).split("/") }, // <-- preserve the requested URL while loading the NotFound component.
          query: to.query,
          hash: to.hash,
        });
      }
      //else redirect to not found
      //next({ name: "NotFound" }); // <-- redirect with URL change
      next();
    },
  },
  //User profile route
  {
    path: "/user/:id",
    name: "UserShow",
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
      //next({ name: "NotFound" }); // <-- redirect with URL change
      next({
        name: "NotFound",
        params: { patchMatch: to.path.substring(1).split("/") }, // <-- preserve the requested URL while loading the NotFound component.
        query: to.query,
        hash: to.hash,
      });
    },
  },
  //Category route
  {
    path: "/category/:id",
    name: "CategoryShow",
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
      //next({ name: "NotFound" }); // <-- redirect with URL change
      next({
        name: "NotFound",
        params: { patchMatch: to.path.substring(1).split("/") }, // <-- preserve the requested URL while loading the NotFound component.
        query: to.query,
        hash: to.hash,
      });
    },
  },
  //Forum route
  {
    path: "/forum/:id",
    name: "ForumShow",
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
      //next({ name: "NotFound" }); // <-- redirect with URL change
      next({
        name: "NotFound",
        params: { patchMatch: to.path.substring(1).split("/") }, // <-- preserve the requested URL while loading the NotFound component.
        query: to.query,
        hash: to.hash,
      });
    },
  },
  //Thread route
  {
    path: "/thread/:id",
    name: "ThreadShow",
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
      //next({ name: "NotFound" }); // <-- redirect with URL change
      next({
        name: "NotFound",
        params: { patchMatch: to.path.substring(1).split("/") }, // <-- preserve the requested URL while loading the NotFound component.
        query: to.query,
        hash: to.hash,
      });
    },
  },
  //Not authorized route
  {
    path: "/unauthorized",
    name: "NotAuthorized",
    component: () => import("@/pages/NotAuthorized.vue"),
  },
  //No found route
  {
    path: "/:patchMatch(.*)*",
    name: "NotFound",
    component: () => import("@/pages/NotFound.vue"),
  },
];
