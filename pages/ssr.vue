<template>
  <h1>SSR</h1>
  <p>{{ new Date() }}</p>
</template>

<script setup lang="ts">
useHead({
  title: 'SSR',
  meta: [
    {
      name: 'description',
      content: 'This is a Server-Side Rendered page...',
    },
  ],
});
</script>

<style scoped></style>
