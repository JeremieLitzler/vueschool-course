<script setup lang="ts">
useHead({
  title: 'Home',
});
</script>
<template>
  <h1>Page: Home</h1>
  <h2>Rendering mode</h2>
  <ul>
    <li><nuxt-link to="/spa">SPA</nuxt-link></li>
    <li><nuxt-link to="/static">Static</nuxt-link></li>
    <li><nuxt-link to="/swr">Stale While Revalidate</nuxt-link></li>
    <li><nuxt-link to="/ssr">Server Side Rendering</nuxt-link></li>
  </ul>
</template>

<style scoped></style>
