import PageHomeVue from "@/components/PageHome.vue";
import PageThreadShowVue from "@/components/PageThreadShow.vue";

export const routes = [
  {
    path: "/",
    name: "home",
    component: PageHomeVue,
  },
  {
    path: "/thread/:id",
    name: "ThreadShow",
    component: PageThreadShowVue,
    props: true,
  },
];
