<template>
  <h1>SWR</h1>
  <p>{{ new Date() }}</p>
</template>

<script setup lang="ts">
useHead({
  title: 'SWR',
  meta: [
    {
      name: 'description',
      content: 'This is a Stale While Reloading page...',
    },
  ],
});
</script>

<style scoped></style>
