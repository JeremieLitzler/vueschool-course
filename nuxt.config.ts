// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ["@formkit/nuxt"],
  runtimeConfig: {
    public: {
      formkitProApiKey: process.env.FORMKIT_PRO_API_KEY,
    },
  },
});
