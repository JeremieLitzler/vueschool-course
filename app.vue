<script setup lang="ts">
const route = useRoute();
useHead({
  /**
   * Apply a template for all pages with or without the titleChunk
   *
   * @param titleChunk The child page component may have the `title` set. This is the source of this parameter
   */
  titleTemplate: (titleChunk) =>
    titleChunk ? `${titleChunk} - Demo Movies Search` : 'Demo Movies Search',
  meta: [
    {
      name: 'description',
      content: 'Welcome to the Vueschool OMDB scrapper demo project',
    },
  ],
  link: [
    {
      rel: 'canonical',
      href: `${import.meta.env.VITE_BASE_URL}${route.fullPath}`,
    },
  ],
});
</script>
<template>
  <section class="page">
    <nuxt-layout>
      <nuxt-page />
    </nuxt-layout>
  </section>
</template>
