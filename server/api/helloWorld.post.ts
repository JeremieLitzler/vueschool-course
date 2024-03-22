export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  //return { message: 'Hello Nuxt', method: event.method };
  return { message: body, method: event.method };
});
