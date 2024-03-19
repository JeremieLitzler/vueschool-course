<template>
  <app-page-head>
    <title>Vue.js 3 Master Class Forum Built By Jeremie Litzler</title>
    <meta
      name="description"
      content="An awesome TypeScript, Pinia and Vue.js 3 powered forum!"
    />

    <!-- Social -->
    <meta
      property="og:title"
      content="Vue.js 3 Master Class Forum Built By Jeremie Litzler"
    />
    <meta
      property="og:description"
      content="An Awesome TypeScript, Pinia and Vue.js 3 powered forum!"
    />
    <meta
      property="og:image"
      content="https://vueschool.io/media/f007f6057444d9a7f567163391d2b366/vuejs-3-master-class-not-transparent.jpg"
    />

    <!-- Twitter -->
    <meta
      name="twitter:title"
      content="Vue.js 3 Master Class Forum Built By Jeremie Litzler"
    />
    <meta
      name="twitter:description"
      content="An Awesome  TypeScript, Pinia and Vue.js 3 powered forum!"
    />
    <meta
      name="twitter:image"
      content="https://vueschool.io/media/f007f6057444d9a7f567163391d2b366/vuejs-3-master-class-not-transparent.jpg"
    />
    <meta name="twitter:card" content="summary_large_image" />
  </app-page-head>
  <div class="container">
    <suspense>
      <template #fallback>
        <!-- TODO: bug > doesn't load the spinner work... -->
        <section class="loading"><app-spinner /></section>
      </template>
      <template #default>
        <section>
          <the-header />
          <router-view :key="`${$route.path}${JSON.stringify($route.query)}`" />
        </section>
      </template>
    </suspense>
  </div>
  <app-notifications />
</template>
<script setup lang="ts">
import { RouterView } from 'vue-router';
import TheHeader from '@/components/TheHeader.vue';
// import { useHead } from '@vueuse/head';

// useHead({
//   title: 'Vue.js 3 Master Class Forum Built By Jeremie Litzler',
//   meta: [
//     {
//       name: 'description',
//       content: 'An Awesome  TypeScript, Pinia and Vue.js 3 powered forum!',
//     },
//   ],
//   link: [{ rel: 'canonical', href: import.meta.env.VITE_BASE_URL }],
// });
</script>

<style scoped>
.loading {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
