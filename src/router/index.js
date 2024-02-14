import sourceData from "@/data.json";
import AppHome from "@/pages/AppHome.vue";

export const routes = [
  {
    path: "/",
    name: "Home",
    component: AppHome,
  },
  {
    path: "/thread/show/:id",
    name: "ThreadShow",
    component: () => import("@/pages/ThreadShow.vue"),
    props: true,
    beforeEnter: (to, from, next) => {
      //does the thread exists?
      const threadExists = sourceData.threads.find(
        (thread) => thread.id === to.params.id
      );
      //if positive, contine
      //see https://stackoverflow.com/a/62426354
      //threadExists ?? next()
      if (threadExists) {
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
  {
    path: "/:patchMatch(.*)*",
    name: "NotFound",
    component: () => import("@/pages/NotFound.vue"),
  },
];
