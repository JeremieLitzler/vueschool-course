import PageHomeVue from "@/components/PageHome.vue";

export const routes = [
  {
    path: "/",
    name: "Home",
    component: PageHomeVue,
  },
  {
    path: "/thread/show/:id",
    name: "ThreadShow",
    component: () => import("@/components/PageThreadShow.vue"),
    props: true,
  },
  {
    path: "/:patchMatch(.*)*",
    name: "NotFound",
    component: () => import("@/components/PageNotFound.vue"),
  },
];
