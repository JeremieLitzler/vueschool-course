<template>
  <h1>SPA</h1>
  <p>{{ new Date() }}</p>
</template>

<script setup lang="ts">
useHead({
  title: 'SPA',
  meta: [
    {
      name: 'description',
      content: 'This is a SPA page...',
    },
  ],
});
</script>

<style scoped></style>
