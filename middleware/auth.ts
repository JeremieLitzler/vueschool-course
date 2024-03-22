export default defineNuxtRouteMiddleware((to, from) => {
  const userIsLoggedIn = useState('isLoggedIn', () => false);
  console.log('middleware>auth', {
    toName: to.name,
    fromName: from.name,
    userIsLoggedIn: userIsLoggedIn.value,
  });

  if (!userIsLoggedIn) {
    return navigateTo({ name: 'login' });
  }
  if (to.name === 'login' && userIsLoggedIn) {
    return navigateTo({ name: 'index' });
  }
});
