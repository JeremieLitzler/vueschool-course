import { createRouter, createWebHistory } from "vue-router";
import type { RouteRecordRaw, Router, RouterOptions } from "vue-router";
import PageHome from "../components/PageHome.vue";
import PageThreadShow from "../components/PageThreadShow.vue";

const homeRoute: RouteRecordRaw = {
  path: "/",
  name: "home",
  component: PageHome,
};
const threadShowRoute: RouteRecordRaw = {
  path: "/thread/:id",
  name: "ThreadShow",
  component: PageThreadShow, //() => import("../components/PageThreadShow.vue"),
  props: true,
};

const routerOptions: RouterOptions = {
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [homeRoute, threadShowRoute],
};
const router: Router = createRouter(routerOptions);

export default router;
