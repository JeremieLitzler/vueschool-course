<template>
  <h1>Static</h1>
  <p>{{ new Date() }}</p>
</template>

<script setup lang="ts">
useHead({
  title: 'Static',
  meta: [
    {
      name: 'description',
      content: 'This is a Static page...',
    },
  ],
});
</script>

<style scoped></style>
