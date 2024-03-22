export default defineNuxtRouteMiddleware((to, from) => {
  console.log({ source: 'logger', toName: to.name, fromName: from.name });
});
