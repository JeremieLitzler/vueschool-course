// https://nuxt.com/docs/api/configuration/nuxt-config
interface NuxtImageConfig {
  domains: string[];
  provider?: string;
}
const nuxtImageConfig: NuxtImageConfig = {
  domains: ['m.media-amazon.com'],
};
if (import.meta.env.VITE_NUXT_IMAGE_USE_NETLIFY_PROVIDER !== undefined) {
  nuxtImageConfig['provider'] =
    import.meta.env.VITE_NUXT_IMAGE_USE_NETLIFY_PROVIDER;
}
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
  image: nuxtImageConfig,
  imports: {
    dirs: ['stores', 'types'],
  },
  alias: {
    pinia: '/node_modules/@pinia/nuxt/node_modules/pinia/dist/pinia.mjs',
  },
});
