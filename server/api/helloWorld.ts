export default defineEventHandler((event) => {
  //return { message: 'Hello Nuxt', method: event.method };
  return { message: getQuery(event), method: event.method };
});
