<template>
  <TheNavigation />

  <div class="container">
    <RouterView :key="$route.path"></RouterView>
  </div>
</template>

<script setup>
  import TheNavigation from '@/components/TheNavigation.vue';
</script>
<style scoped></style>
