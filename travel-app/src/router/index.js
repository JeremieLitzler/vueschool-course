import { createRouter, createWebHistory } from 'vue-router';
import routes from '@/router/routes';

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    return (
      savedPosition ||
      new Promise((resolve) => {
        setTimeout(() => resolve({ top: 0, behavior: 'smooth' }), 300);
      })
    );
  },
});

router.beforeEach((to, from) => {
  if (to.meta.requiresAuth && !window.userLogged) {
    // Load a login page
    return {
      name: 'login',
      query: { redirect: to.fullPath },
    };
  }

  //Else continue
});

export default router;
