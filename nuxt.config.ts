// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  routeRules: {
    '/spa': { ssr: false },
    '/static': { static: true },
    //Stale While Revalidate
    '/swr': { swr: true },
    //ssr is true by default
    '/ssr': {},
  },
  devtools: { enabled: true },
  modules: [
    [
      '@pinia/nuxt',
      {
        autoImports: ['defineStore', 'acceptHMRUpdate'],
      },
    ],
    '@nuxt/image',
  ],
  imports: {
    dirs: ['stores', 'types'],
  },
  alias: {
    pinia: '/node_modules/@pinia/nuxt/node_modules/pinia/dist/pinia.mjs',
  },
});
