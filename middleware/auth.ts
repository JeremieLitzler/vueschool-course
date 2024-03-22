export default defineNuxtRouteMiddleware((to, from) => {
  const user = useUserStore();
  console.log('middleware>auth', {
    toName: to.name,
    fromName: from.name,
    userIsLoggedIn: user.isLoggedIn,
  });

  if (!userIsLoggedIn) {
    return navigateTo({ name: 'login' });
  }
  if (to.name === 'login' && user.isLoggedIn) {
    return navigateTo({ name: 'index' });
  }
});
