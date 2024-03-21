<script setup lang="ts">
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
});
</script>
<template>
  <div>
    <the-nav-bar />
    <nuxt-page />
  </div>
</template>
