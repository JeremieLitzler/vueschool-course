import { createRouter, createWebHistory } from "vue-router";
import type { Router } from "vue-router";
import PageHome from "../components/PageHome.vue";

const router: Router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: PageHome,
    },
    // {
    //   path: '/about',
    //   name: 'about',
    //   // route level code-splitting
    //   // this generates a separate chunk (About.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: () => import('@/views/AboutView.vue')
    // },
    // { path: '/forum', name: 'about', component: () => import('@/views/ForumView.vue') }
  ],
});

export default router;
